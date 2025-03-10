import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigModule } from '@common/env/env-config.module';
import { CacheModule } from '@infrastructure/cache/cache.module';
import { HealthModule } from '@infrastructure/health/health.module';
import { EventBusModule } from '@infrastructure/messaging/event-bus.module';
import { AuthModule } from '@infrastructure/security/security.module';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { CorsService } from '@infrastructure/web/cors.service';
import { UserEntityPersistance } from '@infrastructure/database/persistances/user.persistance';

@Module({
  imports: [HttpModule, EnvConfigModule, CacheModule, HealthModule, EventBusModule, AuthModule],
  providers: [PrismaService, CorsService, UserEntityPersistance],
  exports: [CacheModule, HealthModule, EventBusModule, AuthModule, PrismaService, CorsService, UserEntityPersistance],
})
export class InfrastructureModule {}
