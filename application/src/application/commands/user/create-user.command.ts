import { UserRole } from '@domain/enums/roles.enum';

export class CreateUserCommand {
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly role: UserRole;
  public readonly verified: boolean;

  constructor({ name, email, password, role = UserRole.USER, verified = false }: { name: string; email: string; password: string; role?: UserRole; verified?: boolean }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.verified = verified;
  }
}
