import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { DomainModule } from '@domain/domain.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { UserController } from '@presentation/controllers/user.controller';
import { AuthController } from '@presentation/controllers/auth.controller';

@Module({
  imports: [ApplicationModule, DomainModule, InfrastructureModule],
  controllers: [UserController, AuthController],
})
export class PresentationModule {}
