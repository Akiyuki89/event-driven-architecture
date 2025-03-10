import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQConfig } from '@infrastructure/messaging/rabbitmq/config/rabbitmq.config';
import { IRabbitMQConfig } from '@shared/interfaces/rabbitmq-config.interface';

@Injectable()
export class RabbitMQSubscriber implements OnModuleInit {
  private channel!: amqp.Channel;
  private readonly logger = new Logger(RabbitMQSubscriber.name);
  private readonly rabbitConfig: IRabbitMQConfig;
  private readonly internalHandlers = new Map<string, (payload: any) => Promise<void>>();
  private readonly externalHandlers = new Map<string, (payload: any) => Promise<void>>();

  constructor(private readonly config: RabbitMQConfig) {
    this.rabbitConfig = this.config.getConfig();
  }

  async onModuleInit(): Promise<void> {
    await this.init();
  }

  async init(): Promise<void> {
    try {
      const connection = await amqp.connect(this.rabbitConfig.url);
      this.channel = await connection.createChannel();

      await this.channel.assertExchange(this.rabbitConfig.internalExchange, 'topic', { durable: true });
      await this.channel.assertExchange(this.rabbitConfig.externalExchange, 'topic', { durable: true });

      this.logger.log('RabbitMQ Subscriber successfully connected!');
    } catch (error) {
      this.logger.error('Error initializing RabbitMQ Subscriber:', error);
    }
  }

  async subscribe(eventName: string, handler: (payload: any) => Promise<void>, queueName: string): Promise<void> {
    if (this.internalHandlers.has(eventName)) {
      this.logger.warn(`Already subscribed to internal event: ${eventName}`);
      return;
    }

    try {
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, this.rabbitConfig.internalExchange, eventName);

      this.channel.consume(queueName, async msg => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            this.logger.log(`Internal event received: ${eventName}`);

            if (this.internalHandlers.has(eventName)) {
              await this.internalHandlers.get(eventName)!(event);
            }

            this.channel.ack(msg);
          } catch (error) {
            this.logger.error(`Error processing event ${eventName}:`, error);
          }
        }
      });

      this.internalHandlers.set(eventName, handler);
      this.logger.log(`Subscribed to internal event: ${eventName} on queue: ${queueName}`);
    } catch (error) {
      this.logger.error(`Error subscribing to internal event ${eventName}:`, error);
    }
  }

  async subscribeToExternal(eventName: string, handler: (payload: any) => Promise<void>, queueName: string): Promise<void> {
    if (this.externalHandlers.has(eventName)) {
      this.logger.warn(`Already subscribed to external event: ${eventName}`);
      return;
    }

    try {
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, this.rabbitConfig.externalExchange, `external.${eventName}`);

      this.channel.consume(queueName, async msg => {
        if (msg) {
          try {
            const event = JSON.parse(msg.content.toString());
            this.logger.log(`External event received: ${eventName}`);

            if (this.externalHandlers.has(eventName)) {
              await this.externalHandlers.get(eventName)!(event);
            }

            this.channel.ack(msg);
          } catch (error) {
            this.logger.error(`Error processing external event ${eventName}:`, error);
          }
        }
      });

      this.externalHandlers.set(eventName, handler);
      this.logger.log(`Subscribed to external event: ${eventName} on queue: ${queueName}`);
    } catch (error) {
      this.logger.error(`Error subscribing to external event ${eventName}:`, error);
    }
  }
}
