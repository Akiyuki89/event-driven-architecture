import { Injectable, Logger } from '@nestjs/common';
import { EnvConfigService } from '@common/env/services/env-config.service';

@Injectable()
export class CorsService {
  private readonly logger = new Logger(CorsService.name);

  constructor(private readonly envService: EnvConfigService) {}

  async setCors(app: any) {
    app.enableCors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = [this.envService.getProdDomain(), this.envService.getLocalDomain()];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    this.logger.log('CORS has been set up');
  }
}
