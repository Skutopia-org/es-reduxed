import {EventBase, EventsRepo} from "..";

export const createEventRepo = <T extends EventBase>(): EventsRepo<T> => {
  const events: T[] = [];
  return {
    getEvents: async (cursor = 0, limit = 1000) => events.slice(cursor, cursor + limit),
    saveEvent: async (event) => {
      // @ts-ignore
      const maxId = Math.max(...events.map(e => e.id).filter(Boolean), 0);
      const newEvent = {...event, id: maxId + 1} as T;
      // Casting because TypeScript doesn't trust it still matches the discriminated union
      events.push(newEvent);
      return {event: newEvent, cursor: events.length};
    },
  }
}

