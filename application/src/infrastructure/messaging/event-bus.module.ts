import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { EnvConfigModule } from '@common/env/env-config.module';
import { RabbitMQConfig } from '@infrastructure/messaging/rabbitmq/config/rabbitmq.config';
import { RabbitMQPublisher } from '@infrastructure/messaging/rabbitmq/rabbitmq.publisher';
import { RabbitMQSubscriber } from '@infrastructure/messaging/rabbitmq/rabbitmq.subscriber';
import { EventBusService } from '@infrastructure/messaging/event-bus/event-bus';
import { EVENT_HANDLER, EXTERNAL_EVENT_HANDLER } from '@shared/decorators/event-handler.decorator';

@Module({
  imports: [EnvConfigModule, DiscoveryModule],
  providers: [RabbitMQConfig, RabbitMQPublisher, RabbitMQSubscriber, EventBusService],
  exports: [RabbitMQConfig, EventBusService],
})
export class EventBusModule implements OnModuleInit {
  private readonly logger = new Logger(EventBusModule.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    this.logger.log(`Initializing EventBusModule!`);
    this.registerEventHandlers();
  }

  private registerEventHandlers() {
    const providers = this.discoveryService.getProviders();

    providers.forEach(provider => {
      const instance = provider.instance;
      if (!instance) return;

      const eventName = this.reflector.get<string>(EVENT_HANDLER, instance.constructor);
      if (eventName) {
        const queueName = `${eventName.toLowerCase()}-queue`;

        this.eventBus.subscribe(eventName, instance.handle.bind(instance), queueName);
        this.logger.log(`Automatically registered INTERNAL event handler: ${eventName} on queue: ${queueName}`);
      }

      const externalEventName = this.reflector.get<string>(EXTERNAL_EVENT_HANDLER, instance.constructor);
      if (externalEventName) {
        const externalQueueName = `external-${externalEventName.toLowerCase()}-queue`;

        this.eventBus.subscribeExternal(externalEventName, instance.handle.bind(instance), externalQueueName);
        this.logger.log(`Automatically registered EXTERNAL event handler: ${externalEventName} on queue: ${externalQueueName}`);
      }
    });
  }
}
