import { Transport } from "@nestjs/microservices";
import { KafkaPubSub } from "./events/kafka-pubsub";
import { IEvent, IEventPublisher } from "../interfaces";
import { Subject } from "rxjs";
import { NotImplementedException } from "@nestjs/common";

interface IEventPublisherConstructor<EventBase extends IEvent> {
    new (subject$: Subject<IEvent>): IEventPublisher;
}

export class PubSubResolver<EventBase extends IEvent> {
    forEvents(transport: Transport): IEventPublisherConstructor<EventBase> {
        switch (transport) {
            case Transport.KAFKA:
                return KafkaPubSub;
            default:
                throw new NotImplementedException(
                    `Event bus transport ${transport} is yet not implemented.`
                );
        }
    }
}
