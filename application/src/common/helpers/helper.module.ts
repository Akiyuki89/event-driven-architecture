import { Module } from '@nestjs/common';
import { EncryptHelper } from '@common/helpers/functions/encrypt.helper';

@Module({
  providers: [EncryptHelper],
  exports: [EncryptHelper],
})
export class HelperModule {}
