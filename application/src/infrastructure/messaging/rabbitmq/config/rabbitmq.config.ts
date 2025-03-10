import { Injectable } from '@nestjs/common';
import { EnvConfigService } from '@common/env/services/env-config.service';
import { IRabbitMQConfig } from '@shared/interfaces/rabbitmq-config.interface';

@Injectable()
export class RabbitMQConfig {
  constructor(private readonly envConfig: EnvConfigService) {}

  getConfig(): IRabbitMQConfig {
    return {
      url: this.envConfig.getRabbitMQUrl(),
      internalExchange: this.envConfig.getRabbitMqInternalExchange(),
      userQueue: this.envConfig.getRabbitMqInternalQueue(),
      externalExchange: this.envConfig.getRabbitMqExternalExchange(),
      externalQueue: this.envConfig.getRabbitMqExternalQueue(),
    };
  }
}
