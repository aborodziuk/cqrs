import { Subject } from 'rxjs';
import { ICommand, ICommandPublisher } from "../../interfaces";
import { ClientKafka } from "@nestjs/microservices";
import { COMMANDS_PUBLISHER_CLIENT } from "../../constants";
import { Inject, OnModuleInit } from "@nestjs/common";
import { defaultGetEventName } from "../../helpers/default-get-event-name";
import { IPublishableQuery } from "../../interfaces/queries/publishable-query.interface";
import { IMessageSource } from "../../interfaces/commands/message-source.interface";

export class KafkaCommandsPubSub<CommandBase extends ICommand = ICommand>
    implements ICommandPublisher<CommandBase>, IMessageSource<CommandBase>, OnModuleInit {

    private subject$: Subject<CommandBase>;

    constructor(
        @Inject(COMMANDS_PUBLISHER_CLIENT)
        private readonly client: ClientKafka
    ) {}

    onModuleInit(): void {
        this.client.subscribeToResponseOf('test3');
    }

    async publish<T extends CommandBase>(pattern: string, commandData: T): Promise<any> {
        const command: IPublishableQuery<T> = {
            queryType: defaultGetEventName(commandData),
            data: commandData
        };
        console.log('commanding');

        return this.client.send(pattern, command);
    }

    bridgeCommandsTo<T extends CommandBase>(subject: Subject<T>): void {
        this.subject$ = subject;
    }
}
