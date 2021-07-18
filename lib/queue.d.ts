import { Store } from 'redux';
import { EventBase, EventsRepo } from './index';
export declare type Queue = {
    enqueue: (id: number) => void;
    registerPromise: (id: number, resolver: PromiseResolver) => void;
};
export declare type PromiseResolver = (value: Store<any, any>) => void;
export declare const getQueue: <T extends EventBase>(reduxStore: Store<any, any>, eventsRepo: EventsRepo<T>) => Queue;
//# sourceMappingURL=queue.d.ts.map