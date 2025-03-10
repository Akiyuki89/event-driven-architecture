import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventHandler } from '@shared/decorators/event-handler.decorator';
import { UserCreatedEvent } from '@application/events/export-all.events';
import { EventBusService } from '@infrastructure/messaging/event-bus/event-bus';

@EventHandler('user.created')
@Injectable()
export class UserCreatedSubscriber implements OnModuleInit {
  private readonly logger = new Logger(UserCreatedSubscriber.name);

  constructor(private readonly eventBus: EventBusService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log(`Registering UserCreatedSubscriber for user.created`);
  }

  async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.log(`Event received: UserCreatedEvent to user: ${event.user.name}`);
    this.logger.log(`Payload: ${JSON.stringify(event)}`);

    console.log(`Sending user payload to feed microservice...`);

    await this.eventBus.publishExternal('user.created', event);
    this.logger.log(`User.created event sent to external feeds microservice.`);
  }
}
