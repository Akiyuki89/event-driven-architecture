import { IsNotEmpty, IsString, IsEmail, Matches, MaxLength, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '@shared/decorators/match.decorator';
import { UserRole } from '@domain/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'UserName Example', description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'email@example.com', description: 'E-mail do usuário' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'Senha do usuário', minLength: 8, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'The password must have a maximum of 20 characters' })
  @Matches(/(?=.*\d)/, { message: 'The password must contain at least one number' })
  @Matches(/(?=.*[a-z])/, { message: 'The password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'The password should contain at least 1 uppercase character' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'The password must contain at least one special character' })
  readonly password: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'Senha do usuário', minLength: 8, maxLength: 20 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Match('password', { message: 'Passwords does not match' })
  readonly confirmPassword: string;

  @ApiProperty({ example: UserRole.USER, description: 'Tipo de usuário (USER ou ADMIN)', enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole, { message: 'Role must be either USER or ADMIN' })
  @IsNotEmpty()
  readonly role: UserRole;
}
