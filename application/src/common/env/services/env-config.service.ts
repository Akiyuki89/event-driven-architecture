import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from '@shared/interfaces/env-config.interface';

@Injectable()
export class EnvConfigService implements IEnvConfig {
  constructor(private configService: ConfigService) {}

  // JWT
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') ?? 'secret';
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_SECRET_REFRESH') ?? 'secret';
  }

  getJwtExpiresInSeconds(): number {
    return this.configService.get<number>('JWT_EXPIRES_IN_SECONDS') ?? 3600;
  }

  getJwtRefreshExpiresInSeconds(): number {
    return this.configService.get<number>('JWT_EXPIRES_REFRESH_IN_SECONDS') ?? 3600;
  }

  // CORS
  getProdDomain(): string {
    return this.configService.get<string>('PROD_DOMAIN') ?? 'localhost:3000';
  }

  getLocalDomain(): string {
    return this.configService.get<string>('LOCAL_DOMAIN') ?? 'localhost:3000';
  }

  // Redis
  getRedisUrl(): string {
    return this.configService.get<string>('REDIS_URL') ?? 'redis://localhost';
  }

  // Queue
  getRabbitMQUrl(): string {
    return this.configService.get<string>('RABBITMQ_URL') ?? 'amqp://localhost';
  }

  getRabbitMqInternalExchange(): string {
    return this.configService.get<string>('RABBITMQ_INTERNAL_EXCHANGE') ?? 'internal_exchange';
  }

  getRabbitMqInternalQueue(): string {
    return this.configService.get<string>('RABBITMQ_INTERNAL_QUEUE') ?? 'default_queue';
  }

  getRabbitMqExternalExchange(): string {
    return this.configService.get<string>('RABBITMQ_EXTERNAL_EXCHANGE') ?? 'external_exchange';
  }

  getRabbitMqExternalQueue(): string {
    return this.configService.get<string>('RABBITMQ_EXTERNAL_QUEUE') ?? 'default_queue';
  }
}
