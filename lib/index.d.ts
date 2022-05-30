import { eventStoreReduxEnhancer } from './enhancer';
import { initialiseEventSourcingSystem } from './initialisation';
import { Store } from 'redux';
declare type AppendEventResult<T> = {
    cursor: number;
    event: T;
};
export declare type EventBase = {
    id?: number;
    type: string;
    payload?: unknown;
    version: number;
};
export declare type EventStoreBase = {
    eventStoreMetadata: {
        lastEventId: number;
    };
};
export declare type EventsRepo<T extends EventBase> = {
    getEventRange: (fromId: number, toId: number) => Promise<T[]>;
    getEvents: (cursor?: number, limit?: number) => Promise<T[]>;
    saveEvent: (event: Omit<T, 'id' | 'created_at'>) => Promise<AppendEventResult<T>>;
};
export declare type EventStoreSubscriber = <S, E extends EventBase>(store: Store<S, E>) => Promise<void>;
export declare type EventStoreProvider<T extends EventBase> = {
    eventsRepo: EventsRepo<T>;
    subscriber: EventStoreSubscriber;
};
export { initialiseEventSourcingSystem, eventStoreReduxEnhancer };
//# sourceMappingURL=index.d.ts.map