import { Transport } from "@nestjs/microservices";
import { IEventPublisher } from "./events/event-publisher.interface";

export interface EventsPubSubOptions<EventPublisherBase extends IEventPublisher> {
    transport: Transport;
    clientFactory: (...args: any[]) => EventPublisherBase;
}

export interface CqrsModuleOptions<EventPublisherBase extends IEventPublisher> {
    events: EventsPubSubOptions<EventPublisherBase>;
}
