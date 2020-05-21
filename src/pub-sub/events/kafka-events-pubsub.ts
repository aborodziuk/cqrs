import { Subject } from 'rxjs';
import { Inject } from "@nestjs/common";
import { IEvent, IEventPublisher, IMessageSource } from "../../interfaces";
import { IPublishableEvent } from "../../interfaces";
import { EVENTS_PUBLISHER_CLIENT } from "../../constants";
import { defaultGetEventName } from "../../helpers/default-get-event-name";
import { IPubSubClient } from "../../interfaces/pub-sub-client.interface";

export class KafkaEventsPubSub<EventBase extends IEvent = IEvent>
    implements IEventPublisher<EventBase>, IMessageSource<EventBase> {

    private subject$: Subject<EventBase>;

    constructor(
        @Inject(EVENTS_PUBLISHER_CLIENT)
        private readonly client: IPubSubClient
    ) {}

    async publish<T extends EventBase>(pattern: string, eventData: T): Promise<void> {
        const event: IPublishableEvent<T> = {
            eventType: defaultGetEventName(eventData),
            data: eventData
        };

        await this.client.emit(pattern, event);
    }

    bridgeEventsTo<T extends EventBase>(subject: Subject<T>): void {
        this.subject$ = subject;
    }
}
