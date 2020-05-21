import { IQuery } from "./query.interface";
import { IQueryPublisher } from "./query-publisher.interface";
import { ClientProvider } from "../client-provider.interface";

export interface QueriesPubSubOptions<QueryBase extends IQuery = IQuery> {
    pubSub: new () => IQueryPublisher<QueryBase>;
    clientProvider: ClientProvider;
}
