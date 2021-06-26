import { Store } from 'redux';

type AppendEventResult<T> = {
  cursor: number,
  event: T,
};

export type EventBase = {
  id: number;
  type: string;
  payload: unknown;
  version: number;
}

export type EventsRepo<T extends EventBase> = {
  getEvents: (cursor?: number, limit?: number) => Promise<T[]>;
  saveEvent: (event: Omit<T, 'id'>) => Promise<AppendEventResult<T>>;
}

export type EventStoreSubscriber = <T extends EventBase>(args: any) => Promise<void>;

export type EventStoreProvider<T extends EventBase> = {
  eventsRepo: EventsRepo<T>;
  subscriber: EventStoreSubscriber;
}

type Props<T extends EventBase> = {
  reduxStore: Store;
  eventStoreProvider: EventStoreProvider<T>;
}
/**
 *
 */
export const initialiseEventSourcingSystem = async <T extends EventBase>({reduxStore, eventStoreProvider}: Props<T>) => {
  const {eventsRepo, subscriber} = eventStoreProvider;
  const startTime = new Date();
  await replayExistingEvents(eventsRepo, reduxStore,0);
  const endTime = new Date();
  await subscriber(reduxStore);
  return {
    meta: {
      replayDuration: endTime.getTime() - startTime.getTime(),
    },
    saveEvent: eventsRepo.saveEvent,
  }
};

const replayExistingEvents = async <T extends EventBase>(eventsRepo: EventsRepo<T>, reduxStore: Store, cursor = 0) => {
  console.info(`Replaying events from cursor [${cursor}]`);
  const events = await eventsRepo.getEvents(cursor);
  const ids = events.map(e => e.id).filter(Boolean) as number[];
  // TypeScript wasn't correctly narrowing the type after .filter so i had to cast.
  const maxId = Math.max(...ids, 0);
  if (maxId === 0) {
    console.info(`Replay completed at cursor [${cursor}]`)
    return;
  }
  events.forEach(e => reduxStore.dispatch(e));
  await replayExistingEvents(eventsRepo, reduxStore, maxId);
}

