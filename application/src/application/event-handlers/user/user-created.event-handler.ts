import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '@application/commands/export-all.commands';
import { UserCreatedEvent } from '@application/events/export-all.events';
import { EncryptHelper } from '@common/helpers/functions/encrypt.helper';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';
import { EventBusService } from '@infrastructure/messaging/event-bus/event-bus';

@CommandHandler(CreateUserCommand)
@Injectable()
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);

  constructor(
    @Inject(USER_INJECT_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    this.logger.log(`Received CreateUserCommand: ${JSON.stringify(command)}`);

    const hashedPassword = await EncryptHelper.encryptPassword(command.password);

    const user = new UserEntity(
      new Date().getTime().toString(),
      command.name,
      command.email,
      hashedPassword,
      command.role,
      command.verified,
    );

    this.logger.log(`Creating user in repository: ${JSON.stringify(user)}`);

    const persistedUser = await this.userRepository.createUser(user);
    this.logger.log(`User created successfully with ID: ${persistedUser._id}`);

    const event = new UserCreatedEvent(persistedUser);

    await this.eventBus.publish('user.created', event);
    
    this.logger.log(`Published event: user.created with ID ${persistedUser._id}`);
    return persistedUser;
  }
}
