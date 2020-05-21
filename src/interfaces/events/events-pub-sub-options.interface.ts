import { IEvent } from "./event.interface";
import { IEventPublisher } from "./event-publisher.interface";

export interface EventsPubSubOptions<EventBase extends IEvent = IEvent> {
    pubSub: new () => IEventPublisher;
    clientFactory?: (...args: any[]) => {};
}
