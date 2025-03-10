import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { UpdateUserCommand } from '@application/commands/export-all.commands';
import { UserUpdatedEvent } from '@application/events/export-all.events';
import { EncryptHelper } from '@common/helpers/functions/encrypt.helper';
import { UserRepository } from '@domain/repositories/user.repository';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';

@CommandHandler(UpdateUserCommand)
@Injectable()
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  private readonly logger = new Logger(UpdateUserHandler.name);

  constructor(
    @Inject(USER_INJECT_TOKEN) 
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    this.logger.log(`Updating user: ID ${command.userId}`);

    const existingUser = await this.userRepository.readUserById(command.userId);
    if (!existingUser) {
      this.logger.warn(`User not found: ID ${command.userId}`);
      throw new Error(`User with ID ${command.userId} not found.`);
    }

    if (command.name) existingUser.setName(command.name);
    if (command.email) existingUser.setEmail(command.email);
    if (command.role) existingUser.setRole(command.role);
    if (command.verified !== undefined) existingUser.verify();
    if (command.password) {
      const encryptedPassword = await EncryptHelper.encryptPassword(command.password);
      await existingUser.setPassword(encryptedPassword);
    }

    const updatedUser = await this.userRepository.updateUser(command.userId, existingUser);

    if (!updatedUser) {
      throw new Error(`Failed to update user: ID ${command.userId}`);
    }

    this.logger.log(`User updated successfully: ID ${command.userId}`);

    this.eventBus.publish(new UserUpdatedEvent(updatedUser));

    this.logger.log(`Published UserUpdatedEvent: ID ${command.userId}`);
  }
}
