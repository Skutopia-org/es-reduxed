"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostresEventStoreProvider = void 0;
const pg_listen_1 = __importDefault(require("pg-listen"));
const repository_1 = require("./repository");
const queue_1 = require("../queue");
const createPostresEventStoreProvider = ({ eventSchema, poolConfig, }) => {
    const EVENT_CHANNEL_NAME = 'event_added';
    const eventsRepo = repository_1.createEventRepo(eventSchema, poolConfig);
    return {
        eventsRepo,
        subscriber: async (reduxStore) => {
            const subscriber = pg_listen_1.default(poolConfig);
            const queue = queue_1.getQueue(reduxStore, eventsRepo);
            subscriber.notifications.on(EVENT_CHANNEL_NAME, ({ event_id }) => {
                queue.enqueue(event_id);
            });
            subscriber.events.on('error', (error) => {
                console.error('Fatal database connection error:', error);
                process.exit(1);
            });
            subscriber.events.on('reconnect', (attemptNumber) => {
                console.warn(`Reconnecting to [${EVENT_CHANNEL_NAME}] attempt [${attemptNumber}]`);
            });
            process.on('exit', () => {
                subscriber.close();
            });
            await subscriber.connect();
            await subscriber.listenTo(EVENT_CHANNEL_NAME);
        },
    };
};
exports.createPostresEventStoreProvider = createPostresEventStoreProvider;
