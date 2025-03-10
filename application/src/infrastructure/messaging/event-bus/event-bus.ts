import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RabbitMQPublisher } from '@infrastructure/messaging/rabbitmq/rabbitmq.publisher';
import { RabbitMQSubscriber } from '@infrastructure/messaging/rabbitmq/rabbitmq.subscriber';

@Injectable()
export class EventBusService implements OnModuleInit {
  private readonly logger = new Logger(EventBusService.name);
  private isInitialized = false;

  constructor(
    private readonly publisher: RabbitMQPublisher,
    private readonly subscriber: RabbitMQSubscriber,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.isInitialized) return;

    await this.publisher.init();
    await this.subscriber.init();

    this.isInitialized = true;
    this.logger.log('EventBusService initialized successfully');
  }

  async publish(eventName: string, payload: any): Promise<void> {
    this.logger.log(`Publishing internal event: ${eventName}`);
    await this.publisher.publish(eventName, payload);
  }

  async subscribe(eventName: string, handler: (payload: any) => Promise<void>, queueName: string): Promise<void> {
    this.logger.log(`Subscribing to internal event: ${eventName} (Queue: ${queueName})`);
    await this.subscriber.subscribe(eventName, handler, queueName);
  }

  async publishExternal(eventName: string, payload: any): Promise<void> {
    this.logger.log(`Publishing external event: ${eventName}`);
    await this.publisher.publishToExternal(eventName, payload);
  }

  async subscribeExternal(eventName: string, handler: (payload: any) => Promise<void>, queueName: string): Promise<void> {
    this.logger.log(`Subscribing to external event: ${eventName} (Queue: ${queueName})`);
    await this.subscriber.subscribeToExternal(eventName, handler, queueName);
  }
}
