import { EventBase, EventStoreProvider } from '../';
import { PoolConfig } from 'pg';
declare type Props = {
    eventSchema?: string;
    poolConfig: PoolConfig;
};
export declare const createPostgresEventStoreProvider: <T extends EventBase>({ eventSchema, poolConfig, }: Props) => EventStoreProvider<T>;
export {};
//# sourceMappingURL=index.d.ts.map