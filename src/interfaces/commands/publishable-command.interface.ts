import { ICommand } from "./command.interface";

export interface IPublishableCommand<CommandBase extends ICommand = ICommand> {
    readonly messageType: string;
    readonly payloadType: string;
    readonly timestamp: number;
    data: CommandBase;
}
