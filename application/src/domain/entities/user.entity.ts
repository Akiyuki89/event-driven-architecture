import { UserRole } from '@domain/enums/roles.enum';
import { EncryptHelper } from '@common/helpers/functions/encrypt.helper';

export class UserEntity {
  public readonly _id: string;
  private name: string;
  private email: string;
  private password: string;
  private role: UserRole;
  private verified: boolean;
  public readonly createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, name: string, email: string, password: string, role: UserRole = UserRole.USER, verified: boolean = false, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.verified = verified;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Getters
  public get id(): string {
    return this._id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public isVerified(): boolean {
    return this.verified;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Setters
  public setName(name: string): void {
    this.name = name;
    this.touch();
  }

  public setEmail(email: string): void {
    this.email = email;
    this.touch();
  }

  public async setPassword(password: string): Promise<void> {
    this.password = await EncryptHelper.encryptPassword(password);
    this.touch();
  }

  public setRole(role: UserRole): void {
    this.role = role;
    this.touch();
  }

  public verify(): void {
    this.verified = true;
    this.touch();
  }

  public async checkPassword(password: string): Promise<boolean> {
    return EncryptHelper.validatePassword(password, this.password);
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
