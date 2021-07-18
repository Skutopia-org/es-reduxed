import { expect } from 'chai';
import { performance } from 'perf_hooks';
import { tinyFixtures } from 'tiny-fixtures';
import { initialiseEventSourcingSystem } from '../src';
import { createPostresEventStoreProvider } from '../src/postgres';
import { pool, poolConfig } from './db';
import { Events, reduxStore } from './store';
import { Pool } from 'pg';
import * as fs from 'fs';
import { EventStoreProvider } from '../src';

const { createFixtures } = tinyFixtures(new Pool(poolConfig));

describe('redux with psql provider', () => {
  let provider: EventStoreProvider<Events>;
  let raiseEvent: <E>(
    event: Omit<Events, 'id'>
  ) => Promise<ReturnType<() => { count: number; largeMessage: string }>>;

  before(async () => {
    const [setupFixtures] = createFixtures('core_domain.event_store', [
      {
        type: 'COUNTED',
        version: 1,
      },
    ]);
    await setupFixtures();
    provider = createPostresEventStoreProvider<Events>({
      eventSchema: 'core_domain',
      poolConfig,
    });

    const init = await initialiseEventSourcingSystem<
      ReturnType<typeof reduxStore.getState>,
      Events
    >({
      reduxStore,
      eventStoreProvider: provider,
    });
    raiseEvent = init.raiseEvent;
  });

  after(async () => {
    await pool.query(`TRUNCATE core_domain.event_store RESTART IDENTITY`);
  });

  it('does the docs', async () => {
    const state = reduxStore.getState();
    expect(state.count).to.equal(1);

    const newState = await raiseEvent({
      type: 'COUNTED',
      version: 1,
    });
    expect(newState.count).to.equal(2);
  });
  it('handles events with a payload greater than 8000 bytes', async () => {
    const largePayload = fs.readFileSync('./test/lrgMsg.txt', 'utf8');
    const newState = await raiseEvent({
      type: 'LARGE_MESSAGE',
      version: 1,
      payload: { msg: largePayload },
    });
    expect(newState.largeMessage).to.equal(largePayload);
  });
  it('processes a large number of concurrent events', async () => {
    const state = reduxStore.getState();
    const t0 = performance.now();
    const d0 = new Date();
    // @ts-ignore
    await Promise.allSettled(
      Array.from({ length: 500 }).map(async () =>
        raiseEvent({
          type: 'COUNTED',
          version: 1,
        })
      )
    );
    const t1 = performance.now();
    const d1 = new Date();
    console.log(`processed 500 events in ${t1 - t0}ms.`);
    console.log(`Processed 500 events in ${d1.getTime() - d0.getTime()}ms`);
    expect(reduxStore.getState().count).to.equal(state.count + 500);
  }).timeout(10000);
  // TODO add test to ensure ordering
});
