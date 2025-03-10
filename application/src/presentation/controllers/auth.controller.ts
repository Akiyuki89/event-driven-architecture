import { Controller, Logger, HttpCode, HttpStatus, Request, UseGuards, Body, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@infrastructure/security/services/auth.service';
import { JwtAuthGuard } from '@infrastructure/security/guards/jwt-auth.guard';
import { RolesAuthGuard } from '@infrastructure/security/guards/auth.guard';
import { Roles } from '@shared/decorators/roles.decorator';
import { LoginDto, RefreshTokenDto } from '@shared/dtos/export-all.dtos';
import { RequestWithUser } from '@shared/interfaces/request-with-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`User ${loginDto.email} is attempting to login`);
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RequestWithUser) {
    if (!req.user) {
      throw new Error('User is not authenticated');
    }
    this.logger.log(`User ID ${req.user.id} is logging out`);
    return this.authService.logout(req.user.id);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    this.logger.log(`Refreshing token for user`);
    return this.authService.refreshToken(refreshTokenDto.token);
  }

  @Post('/admin-action')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async adminOnlyAction() {
    return { message: 'Admin action executed successfully' };
  }
}
