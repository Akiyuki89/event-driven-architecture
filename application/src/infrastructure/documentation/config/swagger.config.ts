import { Request, Response, NextFunction } from 'express';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_API_ROOT, SWAGGER_API_NAME, SWAGGER_API_DESCRIPTION, SWAGGER_API_CURRENT_VERSION } from '@infrastructure/documentation/config/swagger-constants.config';
import { addSwaggerTags } from '@infrastructure/documentation/config/swagger-tags.config';

const ALLOWED_EMAILS = ['gabriel.barbosa@gdigitalmkt.com', 'leonardo.rochedo@gdigitalmkt.com', 'joao.seco@gdigitalmkt.com', 'akiyuki.miyama@gdigitalmkt.com'];

export function setupSwagger(app: INestApplication): void {
  let config = new DocumentBuilder().setTitle(SWAGGER_API_NAME).setDescription(SWAGGER_API_DESCRIPTION).setVersion(SWAGGER_API_CURRENT_VERSION).addApiKey(
    { type: 'apiKey', name: 'X-User-Email', in: 'header' },
    'email-auth',
  );

  config = addSwaggerTags(config);

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  interface CustomRequest extends Request {
    headers: {
      'x-user-email'?: string;
      [key: string]: any;
    };
  }

  app.use(SWAGGER_API_ROOT, (req: CustomRequest, res: Response, next: NextFunction) => {
    const userEmail = req.headers['x-user-email'];
    if (!userEmail || !ALLOWED_EMAILS.includes(userEmail)) {
      return res.status(403).send('Acesso negado: E-mail não permitido.');
    }
    next();
  });
}
