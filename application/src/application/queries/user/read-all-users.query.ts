export class ReadAllUsersQuery {
  constructor(
    public readonly page: number,
    public readonly pageSize?: number,
  ) {}
}
