"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventRepo = exports.EVENTS_VERSION = void 0;
const pg_1 = require("pg");
exports.EVENTS_VERSION = 1;
const mapRowToEventBase = (row) => ({ ...row, id: parseInt(row.id, 10) });
const createEventRepo = (schema = 'public', poolConfig) => {
    const pool = new pg_1.Pool(poolConfig);
    return {
        getEventRange: async (fromId, toId) => {
            const result = await pool.query(`
    SELECT * FROM "${schema}"."event_store"
    WHERE "id" >= $1 AND "id" <= $2
    ORDER BY "id"
    `, [fromId, toId]);
            return result.rows.map(mapRowToEventBase);
        },
        getEvents: async (cursor = 0, limit = 1000) => {
            const result = await pool.query(`
    SELECT * FROM "${schema}"."event_store"
    WHERE "id" > $1
    ORDER BY "id"
    LIMIT $2
    `, [cursor, limit]);
            return result.rows.map(mapRowToEventBase);
        },
        saveEvent: async ({ type, payload }) => {
            const result = await pool.query(`
    INSERT INTO "${schema}"."event_store"
    ("version", "type", "payload")
    VALUES ($1, $2, $3)
    RETURNING *
    `, [exports.EVENTS_VERSION, type, payload]);
            const eventFromDb = mapRowToEventBase(result.rows.shift());
            if (!eventFromDb || !eventFromDb.id) {
                throw new Error(`Database error while inserting event: ${{ type, payload }}`);
            }
            return { cursor: eventFromDb.id, event: eventFromDb };
        },
    };
};
exports.createEventRepo = createEventRepo;
