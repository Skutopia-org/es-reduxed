import { Store } from 'redux';
import { EventBase, EventsRepo } from '../index';
export declare type Queue = {
    enqueue: (id: number) => void;
};
export declare const getQueue: <T extends EventBase>(reduxStore: Store<any, any>, eventsRepo: EventsRepo<T>) => Queue;
//# sourceMappingURL=queue.d.ts.map