"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueue = void 0;
const reduceSetSize = (set_) => {
    // underscore suffix indicates set is provided mutatively
    const reduceBy = set_.size - 10000;
    let count = 0;
    for (const entry of set_.values()) {
        if (count > reduceBy) {
            break;
        }
        set_.delete(entry);
        count++;
    }
};
/**
 * This queue system uses a recursive loop and a primitive state machine to
 * ensure that events are dispatched to redux in exactly the order they were
 * received.
 * @param reduxStore
 * @param eventsRepo
 */
const startQueue = (reduxStore, eventsRepo) => {
    const queue = [];
    const dedupeSet = new Set();
    const processedSet = new Set();
    const promiseMap = new Map();
    let state = 'READY';
    const processEvent = (event) => {
        if (event.id === undefined) {
            throw new Error(`Malformed event is missing id: ${event}`);
        }
        if (processedSet.has(event.id)) {
            return;
        }
        reduxStore.dispatch(event);
        const resolver = promiseMap.get(event.id);
        processedSet.add(event.id);
        if (resolver) {
            resolver(reduxStore.getState());
        }
        // Cleanup
        promiseMap.delete(event.id);
        if (event.id % 100000 === 0) {
            reduceSetSize(processedSet);
            reduceSetSize(dedupeSet);
        }
    };
    const processQueue = async () => {
        if (state === 'READY') {
            queue.sort((a, b) => a - b);
            const eventId = queue.shift(); // So we only process if something was in the queue
            if (eventId) {
                state = 'PROCESSING';
                const latestEventId = reduxStore.getState().eventStoreMetadata.lastEventId;
                if (queue.length) {
                    // More than one event in queue, so do bulk processing
                    const lastEventIndex = queue.length - 1; // Save queue length in-case it changes during the await
                    const lastEventId = queue[lastEventIndex];
                    const events = await eventsRepo.getEventRange(latestEventId + 1, lastEventId);
                    events.forEach(processEvent);
                    queue.splice(0, lastEventIndex + 1);
                }
                else {
                    const [event] = await eventsRepo.getEvents(latestEventId, 1);
                    processEvent(event);
                }
                state = 'READY';
                processQueue();
            }
        }
    };
    return {
        enqueue: (id) => {
            const idCoerced = typeof id === 'string' ? parseInt(id, 10) : id;
            if (!dedupeSet.has(idCoerced)) {
                dedupeSet.add(idCoerced);
                queue.push(idCoerced);
                processQueue();
            }
            else {
                console.warn(`Already received event: [${idCoerced}]`);
            }
        },
        registerPromise: (id, resolve) => {
            promiseMap.set(id, resolve);
        },
    };
};
exports.getQueue = (() => {
    let instance;
    return (reduxStore, eventsRepo) => {
        instance =
            instance === undefined ? startQueue(reduxStore, eventsRepo) : instance;
        return instance;
    };
})();
