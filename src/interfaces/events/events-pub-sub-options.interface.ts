import { IEvent } from "./event.interface";
import { IEventPublisher } from "./event-publisher.interface";
import { ClientProvider } from "../client-provider.interface";

export interface EventsPubSubOptions<EventBase extends IEvent = IEvent> {
    pubSub: new () => IEventPublisher<EventBase>;
    clientProvider: ClientProvider
}
