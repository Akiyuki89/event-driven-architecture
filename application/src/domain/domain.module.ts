import { Module } from '@nestjs/common';
import { UserMapper } from '@domain/mappers/user.mapper';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { UserEntityPersistance } from '@infrastructure/database/persistances/user.persistance';

@Module({
  imports: [InfrastructureModule],
  providers: [
    UserMapper,
    {
      provide: USER_INJECT_TOKEN,
      useClass: UserEntityPersistance,
    },
  ],
  exports: [UserMapper, USER_INJECT_TOKEN],
})
export class DomainModule {}
