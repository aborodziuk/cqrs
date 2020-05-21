import { Type } from '@nestjs/common';
import { ICommandHandler } from './commands/command-handler.interface';
import { IEventHandler } from './events/event-handler.interface';
import { IQueryHandler } from './queries/query-handler.interface';
import { IEvent } from "./events/event.interface";

export interface CqrsOptions<EventBase extends IEvent = IEvent> {
  eventHandlers?: Type<IEventHandler>[];
  queryHandlers?: Type<IQueryHandler>[];
  commandHandlers?: Type<ICommandHandler>[];
  sagas?: Type<any>[],
  events: EventBase[]
}
