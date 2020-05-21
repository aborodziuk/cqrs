import { IQuery } from "./query.interface";
import { IQueryPublisher } from "./query-publisher.interface";

export interface QueriesPubSubOptions<QueryBase extends IQuery = IQuery> {
    pubSub: new () => IQueryPublisher;
    clientFactory?: (...args: any[]) => {};
}
