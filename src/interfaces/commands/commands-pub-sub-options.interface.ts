import { ICommand } from "./command.interface";
import { ClientProvider } from "../client-provider.interface";
import { ICommandPublisher } from "./command-publisher.interface";

export interface CommandsPubSubOptions<CommandBase extends ICommand = ICommand> {
    pubSub: new () => ICommandPublisher<CommandBase>;
    clientProvider: ClientProvider;
}
