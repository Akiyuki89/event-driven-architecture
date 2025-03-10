import { UserRole } from "@domain/enums/roles.enum";

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly password?: string,
    public readonly role?: UserRole,
    public readonly verified?: boolean,
  ) {}
}
