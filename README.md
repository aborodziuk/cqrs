## Aktualne zachowanie
Jeżeli używamy EventBus, CommandBus lub Query Bus, mimo że paczka jest mikroserwisem, powiedzmy Kafki
wszystkie Eventy, Query i Komendy są przesyłane do handlerów jedynie lokalnie - nic z nich nie ląduje w Kafce.

Również jeżeli chcemy nasłuchiwać Eventów, możemy zrobić to jedynie używając @EventPattern() który nie ma opcji
zbindowania zwracanej wiadomości do handlera. Prawdę mówiąc, nie ma żadnej możliwości połączenia przychodzącej wiadomości
z handlerem ( oczywiście poza ręcznym przesyłaniem i napisaniem całej obsługi )

By default, NestJS posiada tylko klasę DefaultPubSub, która z pomocą ObservableBus przesyła zdarzenia do handlerów.

## Proponowana zmiana
Możliwość ustawiania oddzielnego PubSub dla Komend, Query, Eventów oraz możliwość propagowania tych zdarzeń lokalnie
w serwisie nasłuchującym. Zamiarem jest stworzenie klas PubSub dla każdego z istniejących Transport'ów. Aktualnie napisałem
jedynie PubSub do Kafki, ale dopisanie reszty to kwestia paru dni.

### 1. Jak to działa 
Link do Pull Requesta [tutaj](https://github.com/aborodziuk/nestjs-microservice-cqrs/pull/1)


Proszę patrzeć jedynie na zmiany w src/ jako, że nazwę paczki zmieniłem tylko tymczasowo dla swojej wygody

Wcześniej importowaliśmy CqrsModule statycznie:

```typescript
@Module({
  imports: [
      CqrsModule,
  ]
})
```

Po zmianie importujemy moduł dynamicznie

```typescript
import ( CqrsModule, KafkaCommandsPubSub } from '@nestjs/cqrs';

@Module({
  imports: [
      CqrsModule.forRoot({
          commands: { // albo uzupełniamy albo opuszczamy, wtedy automatycznie ładuje się DefaultCommandsPubSub
              pubSub: KafkaCommandsPubSub, // lub RabbitMQCommandsPubSub, NatsCommandsPubSub
              clientProvider: <tutaj Provider> // provider dla klienta kafki ( useFactory, useExisting, useValue, useClass )
          },
      }),
  ]
})
```
Dzięki temu, gdy tylko wykorzystamy EventBus, QueryBus lub CommandBus - wydarzenie zostanie automatycznie wyemitowane
do Kafki lub innego pub-sub. W przypadku CommandBus oraz QueryBus zostanie zwrócony response z serwisu nasłuchującego.

W ten sam sposób możemy ustawić "events" oraz "queries". Oczywiście możemy również nie przekazywać nic, wtedy zachowanie
paczki nie zmieni się wcale.

Implementacje metod EventBus.publish(), QueryBus.publish() oraz CommandBus.execute() uległy zmianie i wymagają teraz
parametru "pattern", aby klasa Pub-Sub wiedziała, gdzie ma przesłać dane zdarzenie. Jeżeli pattern będzie pusty, zdarzenie zostanie przekierowane do ObservableBus i spropagowanie jedynie lokalnie.

```typescript
const pattern: string = 'users';
this.eventBus.publish(users, new UserHasRegistered());
```

Aby nadal móc publikować eventy lokalnie, dodane zostały metody publishLocally() oraz executeLocally();

### Introducing PropagationService 

Kolejnym problemem jest zbindowanie przychodzących zdarzeń do handlerów. Przykładowo, wykorzystując

```typescript
@EventPattern('users')
async handle(message: any): Promise<void> {
    console.log(message);
}
```

Dostaniemy rozbudowany response od serwera PubSub zawierający pełno zbędnych informacji. Oczywiście "message" zawiera dane
przesłane przez serwis wysyłający, jednak nie ma możliwości znalezienia odpowiedniego handlera.

Właśnie dla tego celu stworzony został PropagationService, który automatycznie wykrywa czy był to Event, Query czy Komenda
i propaguje wiadomość do ObservableBus, dzięki czemu odpalane są odpowiednie handlery.


#### Serwis 1

```typescript
@Controller()
UsersController {
	// constructor...

	@Get('users')
	getUsers(): User[] {
            return this.queryBus.publish<User[]>(new GetUsersQuery());
        }
}
```

#### Serwis 2

```typescript
import { PropagationService } from '@nestjs/cqrs';

@EventPattern('users')
async handle(message: any): Promise<any> {
    return this.propagationService.propagate(message.value);
}
```

Powyższy przykład zaskutkuje tym, że po wejściu na url example.com/users otrzymamy listę użytkowników z serwisu nr 2. Odpalony zostanie
tam handler @QueryHandler(GetUsersQuery)

Oczywiście same DTO Query musi zostać zdefiniowane oddzielnie w Serwisie 1 oraz Serwisie 2, jako, że są od siebie kompletnie niezależne.
