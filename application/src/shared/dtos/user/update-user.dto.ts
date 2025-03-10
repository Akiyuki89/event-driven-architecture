import { IsString, IsEmail, Matches, MaxLength, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@domain/enums/roles.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'UserName Example', description: 'Nome do usuário', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'email@example.com', description: 'E-mail do usuário', required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'Senha do usuário', minLength: 8, maxLength: 20, required: false })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'The password must have a maximum of 20 characters' })
  @Matches(/(?=.*\d)/, { message: 'The password must contain at least one number' })
  @Matches(/(?=.*[a-z])/, { message: 'The password must contain at least one lowercase letter' })
  @Matches(/(?=.*[A-Z])/, { message: 'The password should contain at least 1 uppercase character' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'The password must contain at least one special character' })
  password?: string;

  @ApiProperty({ example: UserRole.USER, description: 'Tipo de usuário (USER ou ADMIN)', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either USER or ADMIN' })
  role?: UserRole;

  @ApiProperty({ example: true, description: 'Se o usuário está verificado', required: false })
  @IsOptional() 
  @IsBoolean()
  verified?: boolean;
}
