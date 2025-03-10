interface IEnvConfig {
  getProdDomain(): string;
  getLocalDomain(): string;
  getJwtSecret(): string;
  getJwtRefreshSecret(): string;
  getJwtExpiresInSeconds(): number;
  getJwtRefreshExpiresInSeconds(): number;
  getRedisUrl(): string;
  getRabbitMQUrl(): string;
  getRabbitMqInternalExchange(): string;
  getRabbitMqInternalQueue(): string;
  getRabbitMqExternalExchange(): string;
  getRabbitMqExternalQueue(): string;
}

export { IEnvConfig };
