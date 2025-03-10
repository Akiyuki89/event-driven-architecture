import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadUserByIdQuery } from '@application/queries/export-all.queries';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';

@QueryHandler(ReadUserByIdQuery)
export class ReadUserByIdHandler implements IQueryHandler<ReadUserByIdQuery> {
  private readonly logger = new Logger(ReadUserByIdHandler.name);

  constructor(
    @Inject(USER_INJECT_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: ReadUserByIdQuery): Promise<UserEntity | null> {
    this.logger.log(`Fetching user by ID: ${query.userId}`);

    try {
      const user = await this.userRepository.readUserById(query.userId);

      this.logger.log(`Successfully fetched user: ID ${query.userId}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID: ${query.userId}`, error.stack);
      throw error;
    }
  }
}
