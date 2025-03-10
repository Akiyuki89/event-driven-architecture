export interface IEvent {
  readonly name: string;
  readonly payload: any;
  readonly occurredAt: Date;
}
