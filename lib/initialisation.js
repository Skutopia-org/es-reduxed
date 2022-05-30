"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseEventSourcingSystem = void 0;
const queue_1 = require("./queue");
const withReduxStore = (eventsRepo, reduxStore) => {
    const queue = queue_1.getQueue(reduxStore, eventsRepo);
    return async (event) => {
        const eventResult = await eventsRepo.saveEvent(event);
        return new Promise((resolve) => {
            /*
            we need to check current state up here too because the event loop may
            have ticked around and this check may run after the event has already
            been dispatched to redux
             */
            const currentState = reduxStore.getState();
            const { eventStoreMetadata: { lastEventId }, } = currentState;
            if (lastEventId >= eventResult.cursor) {
                resolve(currentState);
                return;
            }
            queue.registerPromise(eventResult.cursor, resolve // We want to enforce on the caller side that we only pass a Store
            );
        });
    };
};
const replayExistingEvents = async (eventsRepo, reduxStore, cursor = 0) => {
    console.info(`Replaying events from cursor [${cursor}]`);
    const events = await eventsRepo.getEvents(cursor);
    const ids = events.map((e) => e.id).filter(Boolean);
    // Type assertion required as TypeScript isn't correctly narrowing after .filter
    const maxId = Math.max(...ids, 0);
    if (maxId === 0) {
        console.info(`Replay completed at cursor [${cursor}]`);
        return;
    }
    events.forEach((e) => reduxStore.dispatch(e));
    await replayExistingEvents(eventsRepo, reduxStore, maxId);
};
/**
 *
 */
const initialiseEventSourcingSystem = async ({ reduxStore, eventStoreProvider, }) => {
    const { eventsRepo, subscriber } = eventStoreProvider;
    const startTime = new Date();
    await replayExistingEvents(eventsRepo, reduxStore, 0);
    const endTime = new Date();
    await subscriber(reduxStore);
    return {
        meta: {
            replayDuration: endTime.getTime() - startTime.getTime(),
        },
        raiseEvent: withReduxStore(eventsRepo, reduxStore),
    };
};
exports.initialiseEventSourcingSystem = initialiseEventSourcingSystem;
