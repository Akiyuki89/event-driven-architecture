import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvConfigModule } from '@common/env/env-config.module';
import { EnvConfigService } from '@common/env/services/env-config.service';
import { DomainModule } from '@domain/domain.module';
import { AuthService } from '@infrastructure/security/services/auth.service';
import { JwtStrategy } from '@infrastructure/security/strategies/jwt.strategy';
import { RolesAuthGuard } from '@infrastructure/security/guards/auth.guard';
import { JwtAuthGuard } from '@infrastructure/security/guards/jwt-auth.guard';

@Module({
  imports: [
    EnvConfigModule,
    DomainModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: async (configService: EnvConfigService) => ({
        global: true,
        secret: configService.getJwtSecret(),
        signOptions: { expiresIn: configService.getJwtExpiresInSeconds() },
      }),
      inject: [EnvConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesAuthGuard, JwtAuthGuard],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
