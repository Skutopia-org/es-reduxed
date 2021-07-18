import { Store } from 'redux';
import { EventBase, EventsRepo } from '../index';

export type Queue = {
  enqueue: (id: number) => void;
};
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
  const dedupeSet: Set<number> = new Set<number>();
  let state: 'READY' | 'PROCESSING' = 'READY';

  const processQueue = async () => {
    if (state === 'READY') {
      queue.sort((a, b) => a - b);
      const eventId = queue.shift(); // So we only process if something was in the queue
      if (eventId) {
        state = 'PROCESSING';
        if (queue.length) {
          // More than one event in queue, so do bulk processing
          const lastEventIndex = queue.length - 1;
          const lastEventId = queue[lastEventIndex];
          const events = await eventsRepo.getEventRange(eventId, lastEventId);
          events.forEach((row) => reduxStore.dispatch(row));
          queue.splice(0, lastEventIndex + 1);
        } else {
          const [event] = await eventsRepo.getEvents(eventId - 1, 1);
          reduxStore.dispatch(event);
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
        typeof id === 'string' ? queue.push(parseInt(id, 10)) : queue.push(id);
        processQueue();
      }
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
