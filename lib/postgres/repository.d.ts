import { EventsRepo, EventBase } from "../";
import { PoolConfig } from 'pg';
export declare const EVENTS_VERSION = 1;
export declare const createEventRepo: <T extends EventBase>(schema: string, poolConfig: PoolConfig) => EventsRepo<T>;
//# sourceMappingURL=repository.d.ts.map