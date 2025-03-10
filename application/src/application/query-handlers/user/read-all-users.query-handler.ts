import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadAllUsersQuery } from '@application/queries/export-all.queries';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRepository } from '@domain/repositories/user.repository';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';

@QueryHandler(ReadAllUsersQuery)
export class ReadAllUsersHandler implements IQueryHandler<ReadAllUsersQuery> {
  private readonly logger = new Logger(ReadAllUsersHandler.name);

  constructor(
    @Inject(USER_INJECT_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: ReadAllUsersQuery): Promise<UserEntity[]> {
    this.logger.log(`Fetching users - Page: ${query.page}, PageSize: ${query.pageSize ?? 1000}`);

    try {
      const users = await this.userRepository.readAll(query.page, query.pageSize);
      
      this.logger.log(`Successfully fetched ${users.length} users.`);
      return users;
    } catch (error) {
      this.logger.error(`Error fetching users`, error.stack);
      throw error;
    }
  }
}
