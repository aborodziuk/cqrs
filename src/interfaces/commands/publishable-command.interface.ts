import { ICommand } from "./command.interface";

export interface IPublishableCommand<CommandBase extends ICommand = ICommand> {
    readonly commandType: string;
    data: CommandBase;
}
