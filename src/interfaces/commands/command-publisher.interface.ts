import { ICommand } from './command.interface';
import { Subject } from "rxjs";

export interface ICommandPublisher<CommandBase extends ICommand = ICommand> {
  publish<T extends CommandBase = CommandBase>(command: T): any;
  bridgeEventsTo<T extends CommandBase>(subject: Subject<T>): void;
}
