import { EventsRepo, EventBase } from "../";
import { Pool, PoolConfig } from 'pg';

export const EVENTS_VERSION = 1;

export const createEventRepo = <T extends EventBase>(schema: string = 'public', poolConfig: PoolConfig): EventsRepo<T> => {
  const pool = new Pool(poolConfig);
  return {
    getEvents: async (cursor = 0, limit = 1000) => {
      const result = await pool.query<T>(`
    SELECT * FROM "${schema}"."event_store"
    WHERE "id" > $1
    LIMIT $2
    `, [cursor, limit]);
      return result.rows;
    },
    saveEvent: async ({ type, payload }) => {
      const result = await pool.query<T>(`
    INSERT INTO "${schema}"."event_store"
    ("version", "type", "payload")
    VALUES ($1, $2, $3)
    RETURNING *
    `, [EVENTS_VERSION, type, payload]);
      const eventFromDb = result.rows.shift();
      if (!eventFromDb || !eventFromDb.id) {
        throw new Error(`Database error while inserting event: ${{ type, payload }}`);
      }
      return { cursor: eventFromDb.id, event: eventFromDb };
    },
  }
};
