import { DynamicModule, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from './command-bus';
import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { defaultCqrsModuleOptions, ICommand, IEvent, IEventPublisher, IQuery } from './interfaces';
import { QueryBus } from './query-bus';
import { ExplorerService } from './services/explorer.service';
import { EVENTS_PUBLISHER_CLIENT, EVENTS_PUB_SUB } from "./constants";
import { CqrsModuleOptions } from "./interfaces/";

@Module({})
export class CqrsModule<
    EventBase extends IEvent = IEvent,
    QueryBase extends IQuery = IQuery,
    CommandBase extends ICommand = ICommand,
  >implements OnApplicationBootstrap {

  constructor(
    @Inject(EVENTS_PUB_SUB) private readonly eventsPubSub: IEventPublisher,
    private readonly explorerService: ExplorerService<EventBase>,
    private readonly eventsBus: EventBus<EventBase>,
    private readonly queryBus: QueryBus<QueryBase>,
    private readonly commandsBus: CommandBus<CommandBase>,
  ) {}

  static forRoot<
    EventBase extends IEvent = IEvent,
    QueryBase extends IQuery = IQuery,
    CommandBase extends ICommand = ICommand,
  >(
    options: CqrsModuleOptions<EventBase, QueryBase, CommandBase> = {},
  ): DynamicModule {
    options = Object.assign(defaultCqrsModuleOptions, options);
    const pubSubProviders = [{
        provide: EVENTS_PUB_SUB,
        useClass: options.events.pubSub
      }, {
        provide: EVENTS_PUBLISHER_CLIENT,
        useFactory: options.events.clientFactory,
      },
    ];

    return {
      module: CqrsModule,
      providers: [
        CommandBus,
        QueryBus,
        EventBus,
        EventPublisher,
        ExplorerService,
        ...pubSubProviders,
      ],
      exports: [CommandBus, QueryBus, EventBus, EventPublisher, EVENTS_PUB_SUB],
    };
  }

  onApplicationBootstrap() {
    const services = this.explorerService.explore();

    this.eventsBus.register(services.eventHandlers);
    this.commandsBus.register(services.commandHandlers);
    this.queryBus.register(services.queryHandlers);
    this.eventsBus.registerSagas(services.sagas);
  }
}
