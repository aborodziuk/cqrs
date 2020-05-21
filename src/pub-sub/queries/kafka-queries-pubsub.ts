import { Subject } from 'rxjs';
import { IQuery, IQueryPublisher } from "../../interfaces";
import { ClientKafka } from "@nestjs/microservices";
import { QUERIES_PUBLISHER_CLIENT } from "../../constants";
import { Inject, OnModuleInit } from "@nestjs/common";
import { defaultGetEventName } from "../../helpers/default-get-event-name";
import { IPublishableQuery } from "../../interfaces/queries/publishable-query.interface";
import { IMessageSource } from "../../interfaces/queries/message-source.interface";

export class KafkaQueriesPubSub<QueryBase extends IQuery = IQuery>
    implements IQueryPublisher<QueryBase>, IMessageSource<QueryBase>, OnModuleInit {

    private subject$: Subject<QueryBase>;

    constructor(
        @Inject(QUERIES_PUBLISHER_CLIENT)
        private readonly client: ClientKafka
    ) {}

    onModuleInit(): void {
        this.client.subscribeToResponseOf('test3');
    }

    async publish<T extends QueryBase>(pattern: string, queryData: T): Promise<any> {
        const query: IPublishableQuery<T> = {
            queryType: defaultGetEventName(queryData),
            data: queryData
        };
        console.log('querying');

        return this.client.send(pattern, query);
    }

    bridgeQueriesTo<T extends QueryBase>(subject: Subject<T>): void {
        this.subject$ = subject;
    }
}
