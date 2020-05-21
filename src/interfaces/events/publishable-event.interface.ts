import { IEvent } from "./event.interface";

export interface IPublishableEvent<EventBase extends IEvent = IEvent> {
    readonly messageType: string;
    readonly className: string;
    data: EventBase;
}
