import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigService } from '@common/env/services/env-config.service';
import { UserRepository } from '@domain/repositories/user.repository';
import { UserMapper } from '@domain/mappers/user.mapper';
import { USER_INJECT_TOKEN } from '@domain/tokens/injection.token';
import { RedisService } from '@infrastructure/cache/services/cache.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_INJECT_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: EnvConfigService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const prismaUser = await this.userRepository.readUserByEmail(email);

    if (!prismaUser) throw new UnauthorizedException('Invalid credentials');

    const user = UserMapper.toPlainObject(prismaUser);

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      id: user.id,
      email: user.getEmail(),
      role: user.getRole(),
      verified: user.isVerified(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getJwtSecret(),
      expiresIn: this.configService.getJwtExpiresInSeconds(),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getJwtRefreshSecret(),
      expiresIn: this.configService.getJwtRefreshExpiresInSeconds(),
    });

    await this.redisService.set(`refresh:${user.id}`, refreshToken, this.configService.getJwtRefreshExpiresInSeconds());

    this.logger.log(`User ${user.getEmail()} logged in`);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.redisService.del(`refresh:${userId}`);
    this.logger.log(`User ID ${userId} logged out`);
    return { message: 'Logged out successfully' };
  }

  async refreshToken(oldRefreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(oldRefreshToken, {
        secret: this.configService.getJwtRefreshSecret(),
      });

      const storedToken = await this.redisService.get(`refresh:${decoded.id}`);
      if (!storedToken || storedToken !== oldRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.readUserById(decoded.id);
      if (!user) throw new UnauthorizedException('User not found');

      const payload = {
        id: user.id,
        email: user.getEmail(),
        role: user.getRole(),
        verified: user.isVerified(),
      };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: this.configService.getJwtSecret(),
        expiresIn: this.configService.getJwtExpiresInSeconds(),
      });

      const newRefreshToken = this.jwtService.sign(payload, {
        secret: this.configService.getJwtRefreshSecret(),
        expiresIn: this.configService.getJwtRefreshExpiresInSeconds(),
      });

      await this.redisService.set(`refresh:${user.id}`, newRefreshToken, this.configService.getJwtRefreshExpiresInSeconds());

      this.logger.log(`User ${user.getEmail()} refreshed token`);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logger.error(`Invalid refresh token attempt`);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
