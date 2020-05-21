import { IEvent } from "./event.interface";
import { IEventPublisher } from "./event-publisher.interface";
import { ClientProvider } from "../client-provider.interface";
import { Constructor } from "../../event-publisher";

export interface EventsPubSubOptions<
    EventBase extends IEvent = IEvent,
    PubSub extends IEventPublisher = IEventPublisher> {
    pubSub: Constructor<PubSub>,
    clientProvider: ClientProvider,
}
