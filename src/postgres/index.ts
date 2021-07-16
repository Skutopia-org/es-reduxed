import createSubscriber from 'pg-listen';
import { Store } from 'redux';
import { createEventRepo } from './repository';
import { EventBase, EventStoreProvider } from '../';
import { PoolConfig } from 'pg';
import { getQueue } from './queue';

type Props = {
  eventSchema?: string;
  poolConfig: PoolConfig;
};

export const createPostresEventStoreProvider = <T extends EventBase>({
  eventSchema,
  poolConfig,
}: Props): EventStoreProvider<T> => {
  const EVENT_CHANNEL_NAME = 'event_added';
  const eventsRepo = createEventRepo<T>(eventSchema, poolConfig);
  return {
    eventsRepo,
    subscriber: async (reduxStore: Store<any, any>) => {
      const subscriber = createSubscriber(poolConfig);
      const queue = getQueue<T>(reduxStore, eventsRepo);

      subscriber.notifications.on(EVENT_CHANNEL_NAME, ({ event_id }) => {
        queue.enqueue(event_id);
      });

      subscriber.events.on('error', (error) => {
        console.error('Fatal database connection error:', error);
        process.exit(1);
      });

      process.on('exit', () => {
        subscriber.close();
      });
      await subscriber.connect();
      await subscriber.listenTo(EVENT_CHANNEL_NAME);
    },
  };
};
