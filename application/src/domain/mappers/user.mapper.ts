import { User as PrismaUser, $Enums } from '@prisma/client';
import { UserEntity } from '@domain/entities/user.entity';
import { UserRole } from '@domain/enums/roles.enum';

export class UserMapper {
  static mapPrismaRoleToDomain(role: $Enums.UserRole): UserRole {
    return role === 'USER' ? UserRole.USER : UserRole.ADMIN;
  }

  static mapDomainRoleToPrisma(role: UserRole): $Enums.UserRole {
    return role === UserRole.USER ? 'USER' : 'ADMIN';
  }

  static toDomain(user: PrismaUser): UserEntity {
    return new UserEntity(user.id, user.name, user.email, user.password, UserMapper.mapPrismaRoleToDomain(user.role), user.verified, user.createdAt, user.updatedAt);
  }

  static toPersistence(user: UserEntity): PrismaUser {
    return {
      id: user._id,
      name: user.getName(),
      email: user.getEmail(),
      password: user['password'],
      role: UserMapper.mapDomainRoleToPrisma(user.getRole()),
      verified: user.isVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }

  static toResponse(user: UserEntity): Record<string, any> {
    return {
      _id: user._id,
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
      verified: user.isVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
  
  static toPlainObject(user: UserEntity): Record<string, any> {
    return {
      id: user._id,
      name: user.getName(),
      email: user.getEmail(),
      password: user['password'],
      role: user.getRole(),
      verified: user.isVerified(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
