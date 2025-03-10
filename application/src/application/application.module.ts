import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler, UpdateUserHandler, DeleteUserHandler } from '@application/event-handlers/export-all.event-handlers';
import { ReadAllUsersHandler, ReadUserByEmailHandler, ReadUserByIdHandler } from '@application/query-handlers/export-all.query-handlers';
import { UserCreatedSubscriber } from '@application/subscribers/export-all.subscribers';
import { HelperModule } from '@common/helpers/helper.module';
import { DomainModule } from '@domain/domain.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';

const CommandHandlers = [CreateUserHandler, UpdateUserHandler, DeleteUserHandler];
const QueryHandlers = [ReadUserByIdHandler, ReadUserByEmailHandler, ReadAllUsersHandler];
const EventSubscribers = [UserCreatedSubscriber];

@Module({
  imports: [CqrsModule, HelperModule, DomainModule, InfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers, ...EventSubscribers],
  exports: [CqrsModule],
})
export class ApplicationModule {}
