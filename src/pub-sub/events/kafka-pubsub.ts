import { Subject } from 'rxjs';
import { IEvent, IEventPublisher, IMessageSource } from "../../interfaces";
import { IPublishableEvent } from "../../interfaces";
import { ClientKafka } from "@nestjs/microservices";
import { EVENTS_PUBLISHER_CLIENT } from "../../constants";
import { Inject } from "@nestjs/common";
import { defaultGetEventName } from "../../helpers/default-get-event-name";

export class KafkaPubSub<EventBase extends IEvent>
    implements IEventPublisher<EventBase>, IMessageSource<EventBase> {

    private subject$: Subject<EventBase>;

    constructor(
        @Inject(EVENTS_PUBLISHER_CLIENT)
        private readonly client: ClientKafka
    ) {}

    async publish<T extends EventBase>(eventData: T): Promise<void> {
        const event: IPublishableEvent<T> = {
            eventType: defaultGetEventName(eventData),
            data: eventData
        };
        console.log('publishing');

        await this.client.emit('test3', event);
    }

    async publishAll<T extends EventBase>(events: T[]): Promise<void> {
        await events.forEach((event: T) => this.publish(event));
    }

    bridgeEventsTo<T extends EventBase>(subject: Subject<T>): void {
        this.subject$ = subject;
    }
}
