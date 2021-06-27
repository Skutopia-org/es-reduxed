import { Store } from 'redux';
import { EventBase, EventsRepo, EventStoreBase, EventStoreProvider } from './index';

const createCheckStateFunc = (resolve: (value: any) => void) =>
  <S extends EventStoreBase>(currentState: S, eventId: number, unsubscribe?: () => void) => {
    const {eventStoreMetadata: { lastEventId } } = currentState;
    if (lastEventId >= eventId) {
      if (unsubscribe) {
        unsubscribe();
      }
      resolve(currentState);
      return true;
    }
    return false;
  }

const withReduxStore = <S extends EventStoreBase, E extends EventBase>(saveEvent: EventsRepo<E>['saveEvent'], reduxStore: Store<S, E>) => async (event: Omit<E, 'id'>): Promise<S> => {
  const eventResult = await saveEvent(event);
  return new Promise((resolve) => {
    /*
    we need to check current state up here too because the event loop may
    have ticked around and the subscription may run after the event has already
    been dispatched to redux
     */
    const checkStateHasEvent = createCheckStateFunc(resolve);
    if (!checkStateHasEvent<S>(reduxStore.getState(), eventResult.cursor)) {
      const unsubscribe = reduxStore.subscribe(() => {
        checkStateHasEvent<S>(reduxStore.getState(), eventResult.cursor, unsubscribe)
      });
    }
  });
}

const replayExistingEvents = async <S, E extends EventBase>(eventsRepo: EventsRepo<E>, reduxStore: Store<S, E>, cursor = 0) => {
  console.info(`Replaying events from cursor [${cursor}]`);
  const events = await eventsRepo.getEvents(cursor);
  const ids = events.map(e => e.id).filter(Boolean) as number[];
  // Type assertion required as TypeScript isn't correctly narrowing after .filter
  const maxId = Math.max(...ids, 0);
  if (maxId === 0) {
    console.info(`Replay completed at cursor [${cursor}]`)
    return;
  }
  events.forEach(e => reduxStore.dispatch(e));
  await replayExistingEvents(eventsRepo, reduxStore, maxId);
}

type Props<S extends EventStoreBase, E extends EventBase> = {
  reduxStore: Store<S, E>;
  eventStoreProvider: EventStoreProvider<E>;
}

/**
 *
 */
export const initialiseEventSourcingSystem = async <S extends EventStoreBase, E extends EventBase>({reduxStore, eventStoreProvider}: Props<S, E>) => {
  const {eventsRepo, subscriber} = eventStoreProvider;
  const startTime = new Date();
  await replayExistingEvents(eventsRepo, reduxStore,0);
  const endTime = new Date();
  await subscriber(reduxStore);
  return {
    meta: {
      replayDuration: endTime.getTime() - startTime.getTime(),
    },
    raiseEvent: withReduxStore<S, E>(eventsRepo.saveEvent, reduxStore),
  }
};