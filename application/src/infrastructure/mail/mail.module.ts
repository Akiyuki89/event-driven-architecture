import { Module } from '@nestjs/common';
import { EnvConfigModule } from '@common/env/env-config.module';
import { EmailService } from '@infrastructure/mail/services/mail.service';

@Module({
  imports: [EnvConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailModule {}
