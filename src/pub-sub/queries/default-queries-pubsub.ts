import { Subject } from 'rxjs';
import { IQuery, IQueryPublisher } from '../../interfaces';

export class DefaultQueriesPubSub<QueryBase extends IQuery = IQuery>
  implements IQueryPublisher<QueryBase> {
  private subject$: Subject<QueryBase>;

  publish<T extends QueryBase>(query: T) {
    this.subject$.next(query);
  }

  bridgeEventsTo<T extends QueryBase>(subject: Subject<T>): void {
    this.subject$ = subject;
  }
}
