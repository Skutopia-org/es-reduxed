import { eventStoreReduxEnhancer } from './enhancer';
import { initialiseEventSourcingSystem } from './initialisation';
import { Store } from 'redux';

type AppendEventResult<T> = {
  cursor: number;
  event: T;
};

export type EventBase = {
  id?: number;
  type: string;
  payload?: unknown;
  version: number;
};

export type EventStoreBase = {
  eventStoreMetadata: {
    lastEventId: number;
  };
};

export type EventsRepo<T extends EventBase> = {
  getEventRange: (fromId: number, toId: number) => Promise<T[]>;
  getEvents: (cursor?: number, limit?: number) => Promise<T[]>;
  saveEvent: (event: Omit<T, 'id'>) => Promise<AppendEventResult<T>>;
};

export type EventStoreSubscriber = <S, E extends EventBase>(
  store: Store<S, E>
) => Promise<void>;

export type EventStoreProvider<T extends EventBase> = {
  eventsRepo: EventsRepo<T>;
  subscriber: EventStoreSubscriber;
};

export { initialiseEventSourcingSystem, eventStoreReduxEnhancer };
