import { Injectable } from "@nestjs/common";
import { MessageWithoutTypeException } from "../exceptions/message-without-type.exception";
import { ExplorerService } from "./explorer.service";
import { IncomingMessage } from "../interfaces/incoming-message.interface";
import { Constructor } from "../event-publisher";
import { EventBus } from "../event-bus";
import { MESSAGE_TYPE_COMMAND, MESSAGE_TYPE_EVENT, MESSAGE_TYPE_QUERY } from "../constants";
import { QueryBus } from "../query-bus";
import { CommandBus } from "../command-bus";

@Injectable()
export class PropagationService {
    constructor(
        private readonly explorerService: ExplorerService,
        private readonly eventBus: EventBus,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    async propagate(message: IncomingMessage): Promise<any> {
        if (!this.hasType(message)) {
            throw new MessageWithoutTypeException(message);
        }

        for (const Occurrence of this.getInternalOccurrences()) {
            if (Occurrence.name === message.payloadType) {
                switch (message.messageType) {
                    case MESSAGE_TYPE_EVENT:
                        return this.eventBus.publishLocally(new Occurrence(...[message.data]));
                    case MESSAGE_TYPE_COMMAND:
                        return this.commandBus.executeLocally(new Occurrence(...[message.data]));
                    case MESSAGE_TYPE_QUERY:
                        return this.queryBus.executeLocally(new Occurrence(...[message.data]));
                }
            }
        }

        return null;
    }

    private getInternalOccurrences(): Constructor<any>[] {
        const { commandDtos, eventDtos, queryDtos } = this.explorerService.explore();
        return [
            ...commandDtos,
            ...eventDtos,
            ...queryDtos
        ];
    }

    private hasType(message: IncomingMessage): boolean {
        return !(!message || !message.messageType || !message.payloadType);
    }
}
