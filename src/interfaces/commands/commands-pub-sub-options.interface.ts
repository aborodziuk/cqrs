import { ICommand } from "./command.interface";
import { ClientProvider } from "../client-provider.interface";
import { ICommandPublisher } from "./command-publisher.interface";
import { Constructor } from "../../event-publisher";

export interface CommandsPubSubOptions<
    CommandBase extends ICommand = ICommand,
    PubSub extends ICommandPublisher = ICommandPublisher> {
    pubSub: Constructor<PubSub>;
    clientProvider: ClientProvider;
}
