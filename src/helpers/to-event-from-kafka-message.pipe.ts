import { Injectable, PipeTransform } from '@nestjs/common';
import { IEvent } from "../interfaces";
import { plainToClass } from "class-transformer";
import { IPublishableEvent } from "../interfaces/events/publishable-event.interface";
import { IKafkaMessage } from "../interfaces/events/kafka-message.interface";

@Injectable()
export class ToEventFromKafkaMessagePipe<EventBase extends IEvent>
    implements PipeTransform {
    private events: EventBase[];

    async transform<T extends EventBase>(
        message: IKafkaMessage<T>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // metadata: ArgumentMetadata,
    ): Promise<T> {
        const event: IPublishableEvent<T> = message.value;
        if (!this.events[event.eventType]) {
            return undefined;
        }

        return plainToClass(this.events[event.eventType], event.data);
    }
}
