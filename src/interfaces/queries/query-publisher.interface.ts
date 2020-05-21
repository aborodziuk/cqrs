import { IQuery } from './query.interface';
import { Subject } from "rxjs";

export interface IQueryPublisher<QueryBase extends IQuery = IQuery> {
  publish<T extends QueryBase = QueryBase>(query: T): any;
  bridgeEventsTo<T extends QueryBase>(subject: Subject<T>): void;
}
