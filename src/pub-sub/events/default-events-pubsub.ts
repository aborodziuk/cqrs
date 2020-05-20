import { Subject } from 'rxjs';
import { IEvent, IEventPublisher, IMessageSource } from '../../interfaces';

export class DefaultEventsPubSub<EventBase extends IEvent>
  implements IEventPublisher<EventBase>, IMessageSource<EventBase> {
  constructor(private subject$: Subject<EventBase>) {}

  publish<T extends EventBase>(event: T) {
    this.subject$.next(event);
  }

  bridgeEventsTo<T extends EventBase>(subject: Subject<T>) {
    this.subject$ = subject;
  }
}
