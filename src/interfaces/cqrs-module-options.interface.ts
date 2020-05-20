import { Transport } from "@nestjs/microservices";

export interface EventsPubSubOptions {
    transport: Transport;
    clientFactory: (...args: any[]) => {};
}

export interface CqrsModuleOptions {
    events: EventsPubSubOptions;
}
