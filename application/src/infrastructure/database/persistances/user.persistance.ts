import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserEntity } from '@domain/entities/user.entity';
import { UserMapper } from '@domain/mappers/user.mapper';
import { UserRepository } from '@domain/repositories/user.repository';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ErrorHandlingUtil } from '@shared/utils/error.util';

@Injectable()
export class UserEntityPersistance implements UserRepository {
  private readonly logger = new Logger(UserEntityPersistance.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: UserEntity): Promise<UserEntity> {
    this.logger.log(`Trying to create user: ${user.getEmail()}`);

    try {
      const userData = UserMapper.toPersistence(user);
      const createdUser = await this.prisma.user.create({ data: userData });

      this.logger.log(`User created successfully: ID ${createdUser.id}`);
      return UserMapper.toDomain(createdUser);
    } catch (error) {
      ErrorHandlingUtil.handlePrismaError(error, 'creating user');
    }
  }

  async readUserById(userId: string): Promise<UserEntity> {
    this.logger.log(`Trying to find user with ID: ${userId}`);

    try {
      if (!userId) {
        this.logger.warn(`Invalid user ID provided`);
        throw new BadRequestException(`User ID is required`);
      }

      const userRecord = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userRecord) {
        this.logger.warn(`User not found: ID ${userId}`);
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      this.logger.log(`User found successfully: ID ${userId}`);
      return UserMapper.toDomain(userRecord);
    } catch (error) {
      this.logger.error(`Error finding user with ID: ${userId}`, error.stack);
      ErrorHandlingUtil.handlePrismaError(error, 'finding user by ID');
    }
  }

  async readUserByEmail(email: string): Promise<UserEntity> {
    this.logger.log(`Trying to find user with email: ${email}`);

    try {
      if (!email) {
        this.logger.warn(`Invalid email provided`);
        throw new BadRequestException(`Email is required`);
      }

      const userRecord = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!userRecord) {
        this.logger.warn(`User not found: Email ${email}`);
        throw new NotFoundException(`User with email ${email} not found.`);
      }

      this.logger.log(`User found successfully: Email ${email}`);
      return UserMapper.toDomain(userRecord);
    } catch (error) {
      this.logger.error(`Error finding user with email: ${email}`, error.stack);
      ErrorHandlingUtil.handlePrismaError(error, 'finding user by email');
    }
  }

  async readAll(page: number, pageSize?: number): Promise<UserEntity[]> {
    this.logger.log(`Fetching users - Page: ${page}, PageSize: ${pageSize ?? 1000}`);

    try {
      if (!page || page < 1) {
        this.logger.warn(`Invalid page number provided: ${page}`);
        throw new BadRequestException(`Page number must be greater than 0`);
      }

      pageSize = pageSize ?? 1000;
      if (pageSize < 1) {
        this.logger.warn(`Invalid page size provided: ${pageSize}`);
        throw new BadRequestException(`Page size must be greater than 0`);
      }

      const skip = (page - 1) * pageSize;

      const users = await this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });

      if (!users.length) {
        this.logger.warn(`No users found`);
        throw new NotFoundException(`No users found for the given parameters.`);
      }

      this.logger.log(`Found ${users.length} users`);
      return users.map(UserMapper.toDomain);
    } catch (error) {
      this.logger.error(`Error fetching users`, error.stack);
      ErrorHandlingUtil.handlePrismaError(error, 'fetching users');
    }
  }

  async updateUser(userId: string, updatedData: Partial<UserEntity>): Promise<UserEntity | null> {
    this.logger.log(`Trying to update user with ID: ${userId}`);

    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!existingUser) {
        this.logger.warn(`User not found: ID ${userId}`);
        return null;
      }

      const userToUpdate = {
        name: updatedData.getName?.() ?? existingUser.name,
        email: updatedData.getEmail?.() ?? existingUser.email,
        password: updatedData['password'] ?? existingUser.password,
        role: updatedData.getRole?.() ? UserMapper.mapDomainRoleToPrisma(updatedData.getRole()) : existingUser.role,
        verified: updatedData.isVerified?.() ?? existingUser.verified,
        updatedAt: new Date(),
      };

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: userToUpdate,
      });

      this.logger.log(`User updated successfully: ID ${updatedUser.id}`);

      return UserMapper.toDomain(updatedUser);
    } catch (error) {
      this.logger.error(`Error updating user with ID: ${userId}`, error.stack);
      ErrorHandlingUtil.handlePrismaError(error, 'updating user');
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    this.logger.log(`Trying to delete user with ID: ${userId}`);

    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!existingUser) {
        this.logger.warn(`User not found: ID ${userId}`);
        return false;
      }

      await this.prisma.user.delete({
        where: { id: userId },
      });

      this.logger.log(`User deleted successfully: ID ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting user with ID: ${userId}`, error.stack);
      ErrorHandlingUtil.handlePrismaError(error, 'deleting user');
    }
  }
}
