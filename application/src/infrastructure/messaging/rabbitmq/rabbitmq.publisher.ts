import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQConfig } from '@infrastructure/messaging/rabbitmq/config/rabbitmq.config';
import { IRabbitMQConfig } from '@shared/interfaces/rabbitmq-config.interface';

@Injectable()
export class RabbitMQPublisher implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQPublisher.name);
  private readonly rabbitConfig: IRabbitMQConfig;
  private channel!: amqp.Channel;
  private connection!: amqp.Connection;

  constructor(private readonly config: RabbitMQConfig) {
    this.rabbitConfig = this.config.getConfig();
  }

  async onModuleInit(): Promise<void> {
    await this.init();
  }

  async init(): Promise<void> {
    try {
      this.logger.log('Connecting to RabbitMQ...');

      this.connection = await amqp.connect(this.rabbitConfig.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.rabbitConfig.internalExchange, 'topic', { durable: true });
      await this.channel.assertExchange(this.rabbitConfig.externalExchange, 'topic', { durable: true });

      this.logger.log('RabbitMQ Publisher connected successfully!');

      this.connection.on('close', async () => {
        this.logger.warn('RabbitMQ connection lost! Attempting to reconnect...');
        await this.reconnect();
      });

      this.connection.on('error', error => {
        this.logger.error('RabbitMQ connection error:', error);
      });
    } catch (error) {
      this.logger.error('Error initializing RabbitMQ Publisher:', error);
      setTimeout(() => this.init(), 5000);
    }
  }

  async reconnect(): Promise<void> {
    try {
      await this.init();
    } catch (error) {
      this.logger.error('Error during RabbitMQ reconnection:', error);
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  async publish(eventName: string, payload: any): Promise<void> {
    if (!this.channel) {
      this.logger.error(`Cannot publish event ${eventName}: RabbitMQ channel is not available.`);
      return;
    }

    try {
      const message = JSON.stringify(payload);
      this.channel.publish(this.rabbitConfig.internalExchange, eventName, Buffer.from(message), { persistent: true });
      this.logger.log(`Event published: ${eventName}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${eventName}:`, error);
    }
  }

  async publishToExternal(eventName: string, payload: any): Promise<void> {
    if (!this.channel) {
      this.logger.error(`Cannot publish external event ${eventName}: RabbitMQ channel is not available.`);
      return;
    }

    try {
      const message = JSON.stringify(payload);
      this.channel.publish(this.rabbitConfig.externalExchange, `external.${eventName}`, Buffer.from(message), { persistent: true });
      this.logger.log(`External event published: ${eventName}`);
    } catch (error) {
      this.logger.error(`Failed to publish external event ${eventName}:`, error);
    }
  }
}
