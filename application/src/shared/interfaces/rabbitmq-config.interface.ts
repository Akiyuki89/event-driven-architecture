interface IRabbitMQConfig {
  url: string;
  internalExchange: string;
  userQueue: string;
  externalExchange: string;
  externalQueue: string;
}

export { IRabbitMQConfig };
