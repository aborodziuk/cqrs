import { ICommand } from "./command.interface";
import { ICommandPublisher } from "./command-publisher.interface";

export interface CommandsPubSubOptions<CommandBase extends ICommand = ICommand> {
    pubSub: new () => ICommandPublisher;
    clientFactory?: (...args: any[]) => {};
}
