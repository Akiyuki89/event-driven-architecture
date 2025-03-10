import { DocumentBuilder } from '@nestjs/swagger';

export function addSwaggerTags(config: DocumentBuilder): DocumentBuilder {
  return config.addTag('Health', 'Operations related to load balancer ond enpoint health');
}
