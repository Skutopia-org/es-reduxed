import { Store } from 'redux';
declare type AppendEventResult<T> = {
    cursor: number;
    event: T;
};
export declare type EventBase = {
    id: number;
    type: string;
    payload: unknown;
    version: number;
};
export declare type EventsRepo<T extends EventBase> = {
    getEvents: (cursor?: number, limit?: number) => Promise<T[]>;
    saveEvent: (event: Omit<T, 'id'>) => Promise<AppendEventResult<T>>;
};
export declare type EventStoreSubscriber = <T extends EventBase>(args: any) => Promise<void>;
export declare type EventStoreProvider<T extends EventBase> = {
    eventsRepo: EventsRepo<T>;
    subscriber: EventStoreSubscriber;
};
declare type Props<T extends EventBase> = {
    reduxStore: Store;
    eventStoreProvider: EventStoreProvider<T>;
};
/**
 *
 */
export declare const initialiseEventSourcingSystem: <T extends EventBase>({ reduxStore, eventStoreProvider }: Props<T>) => Promise<{
    meta: {
        replayDuration: number;
    };
    saveEvent: (event: Omit<T, "id">) => Promise<AppendEventResult<T>>;
}>;
export {};
//# sourceMappingURL=index.d.ts.map