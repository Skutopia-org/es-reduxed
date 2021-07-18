import { Store } from 'redux';
import { EventBase, EventsRepo } from './index';

export type Queue = {
  enqueue: (id: number) => void;
  registerPromise: (id: number, resolver: PromiseResolver) => void;
};

export type PromiseResolver = (value: Store<any, any>) => void;

/**
 * This queue system uses a recursive loop and a primitive state machine to
 * ensure that events are dispatched to redux in exactly the order they were
 * received.
 * @param reduxStore
 * @param eventsRepo
 */
const startQueue = <T extends EventBase>(
  reduxStore: Store<any, any>,
  eventsRepo: EventsRepo<T>
) => {
  const queue: number[] = [];
  const dedupeSet = new Set<number>();
  const promiseMap = new Map<number, PromiseResolver>();
  let state: 'READY' | 'PROCESSING' = 'READY';

  const processEvent = (event: EventBase) => {
    reduxStore.dispatch(event);
    if (event.id === undefined) {
      throw new Error(`Malformed event is missing id: ${event}`);
    }
    const resolver = promiseMap.get(event.id);
    if (resolver) {
      resolver(reduxStore.getState());
      promiseMap.delete(event.id);
    }
  };

  const processQueue = async () => {
    if (state === 'READY') {
      queue.sort((a, b) => a - b);
      const eventId = queue.shift(); // So we only process if something was in the queue
      if (eventId) {
        state = 'PROCESSING';
        if (queue.length) {
          // More than one event in queue, so do bulk processing
          const lastEventIndex = queue.length - 1; // Save queue length in-case it changes during the await
          const lastEventId = queue[lastEventIndex];
          const events = await eventsRepo.getEventRange(eventId, lastEventId);
          events.forEach(processEvent);
          queue.splice(0, lastEventIndex + 1);
        } else {
          const [event] = await eventsRepo.getEvents(eventId - 1, 1);
          processEvent(event);
        }
        state = 'READY';
        processQueue();
      }
    }
  };

  return {
    enqueue: (id: number | string) => {
      const idCoerced = typeof id === 'string' ? parseInt(id, 10) : id;
      if (!dedupeSet.has(idCoerced)) {
        dedupeSet.add(idCoerced);
        queue.push(idCoerced);
        processQueue();
      } else {
        console.warn(`Out of order event: [${idCoerced}]`);
      }
    },
    registerPromise: (id: number, resolve: PromiseResolver) => {
      promiseMap.set(id, resolve);
    },
  };
};

export const getQueue = (() => {
  let instance: Queue;
  return <T extends EventBase>(
    reduxStore: Store<any, any>,
    eventsRepo: EventsRepo<T>
  ) => {
    instance =
      instance === undefined ? startQueue<T>(reduxStore, eventsRepo) : instance;
    return instance;
  };
})();
