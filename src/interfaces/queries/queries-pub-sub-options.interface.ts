import { IQuery } from "./query.interface";
import { IQueryPublisher } from "./query-publisher.interface";
import { ClientProvider } from "../client-provider.interface";
import { Constructor } from "../../event-publisher";

export interface QueriesPubSubOptions<
    QueryBase extends IQuery = IQuery,
    PubSub extends IQueryPublisher = IQueryPublisher> {
    pubSub: Constructor<QueryBase>;
    clientProvider: ClientProvider;
}
