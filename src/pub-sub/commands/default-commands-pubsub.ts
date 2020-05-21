import { Subject } from 'rxjs';
import { ICommand, ICommandPublisher } from '../../interfaces';

export class DefaultCommandsPubSub<CommandBase extends ICommand = ICommand>
  implements ICommandPublisher<CommandBase> {
  private subject$: Subject<CommandBase>;

  publish<T extends CommandBase>(command: T) {
    this.subject$.next(command);
  }

  bridgeEventsTo<T extends CommandBase>(subject: Subject<T>): void {
    this.subject$ = subject;
  }
}
