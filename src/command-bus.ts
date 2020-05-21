import { Inject, Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import 'reflect-metadata';
import { COMMAND_HANDLER_METADATA } from './decorators/constants';
import { CommandHandlerNotFoundException } from './exceptions/command-not-found.exception';
import { COMMANDS_PUB_SUB } from './constants';
import {
  ICommand,
  ICommandBus,
  ICommandHandler,
  ICommandPublisher,
} from './interfaces/index';
import { ObservableBus } from './utils/observable-bus';
import { InvalidCommandHandlerException } from "./exceptions";

export type CommandHandlerType = Type<ICommandHandler<ICommand>>;

@Injectable()
export class CommandBus<CommandBase extends ICommand = ICommand>
  extends ObservableBus<CommandBase>
  implements ICommandBus<CommandBase> {
  private handlers = new Map<string, ICommandHandler<CommandBase>>();

  constructor(
      @Inject(COMMANDS_PUB_SUB) private readonly _publisher: ICommandPublisher<CommandBase>,
      private readonly moduleRef: ModuleRef
  ) {
    super();
    this._publisher.bridgeEventsTo(this.subject$);
  }

  get publisher(): ICommandPublisher<CommandBase> {
    return this._publisher;
  }

  execute<T extends CommandBase>(command: T): Promise<any> {
    const commandName = this.getCommandName(command as any);
    const handler = this.handlers.get(commandName);
    if (!handler) {
      throw new CommandHandlerNotFoundException(commandName);
    }
    this.subject$.next(command);
    return handler.execute(command);
  }

  bind<T extends CommandBase>(handler: ICommandHandler<T>, name: string) {
    this.handlers.set(name, handler);
  }

  register(handlers: CommandHandlerType[] = []) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: CommandHandlerType) {
    const instance = this.moduleRef.get(handler, { strict: false });
    if (!instance) {
      return;
    }
    const target = this.reflectCommandName(handler);
    if (!target) {
      throw new InvalidCommandHandlerException();
    }
    this.bind(instance as ICommandHandler<CommandBase>, target.name);
  }

  private getCommandName(command: Function): string {
    const { constructor } = Object.getPrototypeOf(command);
    return constructor.name as string;
  }

  private reflectCommandName(handler: CommandHandlerType): FunctionConstructor {
    return Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler);
  }
}
