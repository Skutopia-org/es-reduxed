import { Store } from 'redux';
import { EventBase, EventStoreBase, EventStoreProvider } from './index';
declare type Props<S extends EventStoreBase, E extends EventBase> = {
    reduxStore: Store<S, E>;
    eventStoreProvider: EventStoreProvider<E>;
};
/**
 *
 */
export declare const initialiseEventSourcingSystem: <S extends EventStoreBase, E extends EventBase>({ reduxStore, eventStoreProvider }: Props<S, E>) => Promise<{
    meta: {
        replayDuration: number;
    };
    raiseEvent: (event: Omit<E, "id">) => Promise<S>;
}>;
export {};
//# sourceMappingURL=initialisation.d.ts.map