import { Subject } from 'rxjs';
import { ICommand, ICommandPublisher, IMessageSource } from '../../interfaces';

export class DefaultCommandsPubSub<CommandBase extends ICommand = ICommand>
  implements ICommandPublisher<CommandBase>, IMessageSource<CommandBase> {
  private subject$: Subject<CommandBase>;

  publish<T extends CommandBase>(command: T) {
    this.subject$.next(command);
  }

  bridgeEventsTo<T extends CommandBase>(subject: Subject<T>): void {
    this.subject$ = subject;
  }
}
