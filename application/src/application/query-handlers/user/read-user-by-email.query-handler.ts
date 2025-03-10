import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadUserByEmailQuery } from '@application/queries/export-all.queries';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';

@QueryHandler(ReadUserByEmailQuery)
export class ReadUserByEmailHandler implements IQueryHandler<ReadUserByEmailQuery> {
  private readonly logger = new Logger(ReadUserByEmailHandler.name);

  constructor(
    @Inject(USER_INJECT_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: ReadUserByEmailQuery): Promise<UserEntity | null> {
    this.logger.log(`Fetching user by email: ${query.email}`);

    try {
      const user = await this.userRepository.readUserByEmail(query.email);

      this.logger.log(`Successfully fetched user: Email ${query.email}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with email: ${query.email}`, error.stack);
      throw error;
    }
  }
}
