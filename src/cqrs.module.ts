import { DynamicModule, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from './command-bus';
import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';
import { IEvent, IEventPublisher } from './interfaces';
import { QueryBus } from './query-bus';
import { ExplorerService } from './services/explorer.service';
import { EVENTS_PUBLISHER_CLIENT, EVENTS_PUB_SUB } from "./constants";
import { CqrsModuleOptions } from "./interfaces/";
import { PubSubResolver } from "./pub-sub/";

@Module({})
export class CqrsModule<EventBase extends IEvent = IEvent>
  implements OnApplicationBootstrap {
  constructor(
    @Inject(EVENTS_PUB_SUB) private readonly eventsPubSub: IEventPublisher,
    private readonly explorerService: ExplorerService<EventBase>,
    private readonly eventsBus: EventBus<EventBase>,
    private readonly commandsBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  static forRoot(
    uri: string,
    options: CqrsModuleOptions<IEventPublisher>,
  ): DynamicModule {
    const pubSubResolver = new PubSubResolver();
    const pubSubProviders = [{
        provide: EVENTS_PUB_SUB,
        useClass: pubSubResolver.forEvents(options.events.transport),
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
        PubSubResolver,
        ...pubSubProviders,
      ],
      exports: [CommandBus, QueryBus, EventBus, EventPublisher],
    };
  }

  onApplicationBootstrap() {
    const services = this.explorerService.explore();

    this.eventsBus.register(services.eventHandlers);
    this.eventsBus.registerSagas(services.sagas);

    this.commandsBus.register(services.commandHandlers);
    this.queryBus.register(services.queryHandlers);
  }
}
