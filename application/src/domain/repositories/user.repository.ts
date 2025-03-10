import { UserEntity } from '@domain/entities/user.entity';

export interface UserRepository {
  createUser(user: UserEntity): Promise<UserEntity>;
  readUserById(userId: string): Promise<UserEntity | null>;
  readUserByEmail(email: string): Promise<UserEntity | null>;
  readAll(page: number, pageSize?: number): Promise<UserEntity[]>;
  updateUser(userId: string, updatedData: Partial<UserEntity>): Promise<UserEntity | null>;
  deleteUser(userId: string): Promise<boolean>;
}
