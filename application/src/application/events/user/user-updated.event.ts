import { UserEntity } from '@domain/entities/user.entity';
import { UserMapper } from '@domain/mappers/user.mapper';

export class UserUpdatedEvent {
  public readonly user: Record<string, any>;

  constructor(user: UserEntity) {
    this.user = UserMapper.toResponse(user);
  }
}
