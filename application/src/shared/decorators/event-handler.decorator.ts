import { SetMetadata } from '@nestjs/common';

export const EVENT_HANDLER = 'EVENT_HANDLER';
export const EXTERNAL_EVENT_HANDLER = 'EXTERNAL_EVENT_HANDLER';

export const EventHandler = (eventName: string): ClassDecorator => {
  return SetMetadata(EVENT_HANDLER, eventName);
};

export const ExternalEventHandler = (eventName: string): ClassDecorator => {
  return SetMetadata(EXTERNAL_EVENT_HANDLER, eventName);
};
