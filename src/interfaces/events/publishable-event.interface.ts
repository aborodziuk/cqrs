import { IEvent } from "./event.interface";

export interface IPublishableEvent<EventBase extends IEvent = IEvent> {
    readonly eventType: string;
    data: EventBase;
}
