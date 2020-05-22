import { IQuery } from "./query.interface";

export interface IPublishableQuery<QueryBase extends IQuery = IQuery> {
    readonly messageType: string;
    readonly payloadType: string;
    readonly timestamp: number;
    data: QueryBase;
}
