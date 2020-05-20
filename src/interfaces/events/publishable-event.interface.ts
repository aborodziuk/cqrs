import { IEvent } from "./event.interface";

export interface IPublishableEvent<EventBase extends IEvent> {
    readonly eventType: string;
    data: EventBase;
}
