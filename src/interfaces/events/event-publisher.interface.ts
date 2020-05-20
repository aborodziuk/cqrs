import { IEvent } from './event.interface';
import { Subject } from "rxjs";

export interface IEventPublisher<EventBase extends IEvent = IEvent> {
  publish<T extends EventBase = EventBase>(event: T): any;
  publishAll?<T extends EventBase = EventBase>(events: T[]): any;
  bridgeEventsTo<T extends EventBase>(subject: Subject<T>): void;
}
