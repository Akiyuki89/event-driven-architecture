import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CorsService } from '@infrastructure/web/cors.service';
import { setupSwagger } from '@infrastructure/documentation/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setupSwagger(app);

  const corsService = app.get(CorsService);

  await corsService.setCors(app);
  await app.listen(3000);
}
bootstrap();
