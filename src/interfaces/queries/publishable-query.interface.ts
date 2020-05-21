import { IQuery } from "./query.interface";

export interface IPublishableQuery<QueryBase extends IQuery = IQuery> {
    readonly queryType: string;
    data: QueryBase;
}
