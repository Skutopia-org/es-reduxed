import { EventsRepo, EventBase } from '../';
import { Pool, PoolConfig } from 'pg';

export const EVENTS_VERSION = 1;

const mapRowToEventBase = (row: any) => ({ ...row, id: parseInt(row.id, 10) });

export const createEventRepo = <T extends EventBase>(
  schema: string = 'public',
  poolConfig: PoolConfig
): EventsRepo<T> => {
  const pool = new Pool(poolConfig);
  return {
    getEventRange: async (fromId: number, toId: number) => {
      const result = await pool.query<T>(
        `
    SELECT * FROM "${schema}"."event_store"
    WHERE "id" >= $1 AND "id" <= $2
    ORDER BY "id"
    `,
        [fromId, toId]
      );
      return result.rows.map(mapRowToEventBase);
    },
    getEvents: async (cursor = 0, limit = 1000) => {
      const result = await pool.query<T>(
        `
    SELECT * FROM "${schema}"."event_store"
    WHERE "id" > $1
    ORDER BY "id"
    LIMIT $2
    `,
        [cursor, limit]
      );
      return result.rows.map(mapRowToEventBase);
    },
    saveEvent: async ({ type, payload }) => {
      const result = await pool.query<T>(
        `
    INSERT INTO "${schema}"."event_store"
    ("version", "type", "payload")
    VALUES ($1, $2, $3)
    RETURNING *
    `,
        [EVENTS_VERSION, type, payload]
      );
      const eventFromDb = mapRowToEventBase(result.rows.shift());
      if (!eventFromDb || !eventFromDb.id) {
        throw new Error(
          `Database error while inserting event: ${{ type, payload }}`
        );
      }
      return { cursor: eventFromDb.id, event: eventFromDb };
    },
  };
};
