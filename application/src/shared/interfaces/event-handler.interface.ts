import { IEvent } from '@shared/interfaces/event.interface';

export interface IEventHandler<T extends IEvent> {
  handle(event: T): Promise<void>;
}
