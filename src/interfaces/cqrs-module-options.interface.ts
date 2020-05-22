import { DefaultEventsPubSub } from "../pub-sub";
import { IEvent } from "./events/event.interface";
import { DefaultQueriesPubSub } from "../pub-sub";
import { DefaultCommandsPubSub } from "../pub-sub";
import { IQuery } from "./queries/query.interface";
import { ICommand } from "./commands/command.interface";
import { IEventsPubSubOptions } from "./events/events-pub-sub-options.interface";
import { IQueriesPubSubOptions } from "./queries/queries-pub-sub-options.interface";
import { ICommandsPubSubOptions } from "./commands/commands-pub-sub-options.interface";

export interface CqrsModuleOptions<
    EventBase extends IEvent = IEvent,
    QueryBase extends IQuery = IQuery,
    CommandBase extends ICommand = IQuery
> {
    events?: IEventsPubSubOptions<EventBase>;
    queries?: IQueriesPubSubOptions<QueryBase>;
    commands?: ICommandsPubSubOptions<CommandBase>;
}

export const defaultCqrsModuleOptions = {
    events: {
        pubSub: DefaultEventsPubSub,
        clientProvider: {
            useValue: null,
        },
    },
    queries: {
        pubSub: DefaultQueriesPubSub,
        clientProvider: {
            useValue: null,
        },
    },
    commands: {
        pubSub: DefaultCommandsPubSub,
        clientProvider: {
            useValue: null,
        },
    },
} as CqrsModuleOptions;
