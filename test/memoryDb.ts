import { EventsRepo } from '../src';
import { Events } from './store';

export const memoryEventsRepo = ((): EventsRepo<Events> => {
  const db: Required<Events>[] = [];
  return {
    async getEvents(cursor = 0, limit = 1000) {
      return db.sort((a, b) => a!.id - b!.id).slice(cursor, cursor + limit);
    },
    async saveEvent(event) {
      const newId = Math.max(...db.map(({ id }) => id), 0) + 1;
      const newEvent = { id: newId, ...event } as Required<Events>;
      db.push(newEvent);
      return { cursor: newId, event: newEvent };
    },
    async getEventRange(fromId, toId) {
      db.sort((a, b) => a!.id - b!.id);
      const fromIdx = db.findIndex((e) => e.id === fromId);
      const toIdx = db.findIndex((e) => e.id === toId);
      return db.slice(fromIdx, toIdx + 1);
    },
  };
})();
