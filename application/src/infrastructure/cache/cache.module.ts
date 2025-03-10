import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { EnvConfigModule } from '@common/env/env-config.module';
import { EnvConfigService } from '@common/env/services/env-config.service';
import { RedisService } from '@infrastructure/cache/services/cache.service';

@Module({
  imports: [
    EnvConfigModule,
    RedisModule.forRootAsync({
      inject: [EnvConfigService],
      useFactory: (envService: EnvConfigService) => ({
        type: 'single',
        url: envService.getRedisUrl() || 'redis://localhost:6379',
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisModule, RedisService],
})
export class CacheModule {}
