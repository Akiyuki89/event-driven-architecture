import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '@application/commands/export-all.commands';
import { UserDeletedEvent } from '@application/events/export-all.events';
import { UserRepository } from '@domain/repositories/user.repository';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';

@CommandHandler(DeleteUserCommand)
@Injectable()
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  private readonly logger = new Logger(DeleteUserHandler.name);

  constructor(
    @Inject(USER_INJECT_TOKEN) 
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    this.logger.log(`Deleting user: ID ${command.userId}`);

    const existingUser = await this.userRepository.readUserById(command.userId);
    if (!existingUser) {
      this.logger.warn(`User not found: ID ${command.userId}`);
      throw new Error(`User with ID ${command.userId} not found.`);
    }

    const deleted = await this.userRepository.deleteUser(command.userId);
    if (!deleted) {
      throw new Error(`Failed to delete user: ID ${command.userId}`);
    }

    this.logger.log(`User deleted successfully: ID ${command.userId}`);

    this.eventBus.publish(new UserDeletedEvent(command.userId));

    this.logger.log(`Published UserDeletedEvent: ID ${command.userId}`);
  }
}
