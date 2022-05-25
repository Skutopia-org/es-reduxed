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
    reduxStore.dispatch({ type: 'RESET' });
    const state = reduxStore.getState();
    const t0 = performance.now();
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
    console.log(
      `Dispatched & processed 500 events sequentially in ${t1 - t0}ms.`
    );
    expect(reduxStore.getState().count).to.equal(state.count + 500);
  }).timeout(10000);

  it('can process 10,000 events in order', async () => {
    reduxStore.dispatch({ type: 'RESET' });
    const td0 = performance.now();
    const bulkInsert = Array.from({ length: 10001 })
      .map((_, index) => {
        return index % 5001
          ? `(1, 'COUNTED', NULL)`
          : `(1, 'DIVIDE_BY', '${JSON.stringify(
              (index + 1) % 10002 ? 10 : 2
            )}')`;
      })
      .join(',')
      .replace(/(^,)|(,$)/g, '');
    await pool.query(
      `INSERT INTO "core_domain"."event_store" ("version", "type", "payload") VALUES ${bulkInsert}`,
      []
    );

    const td1 = performance.now();
    const startingMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    await raiseEvent({
      type: 'COUNTED',
      version: 1,
    });

    const t1 = performance.now();
    const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const memUsed = endMemory - startingMemory;

    console.log(`Bulk dispatched 10,000 events in ${td1 - td0}ms.`);
    console.log(`Processed 10,000 events in ${t1 - td1}ms.`);
    console.log(`Used ${memUsed} MB of memory`);
    expect(reduxStore.getState().count).to.equal(5500);
  });
  it('consumes ~150 MB processing 100,000 events', async () => {
    reduxStore.dispatch({ type: 'RESET' });
    const bulkInsert = Array.from({ length: 100_000 })
      .map((_, index) => `(1, 'COUNTED', NULL)`)
      .join(',')
      .replace(/(^,)|(,$)/g, '');
    await pool.query(
      `INSERT INTO "core_domain"."event_store" ("version", "type", "payload") VALUES ${bulkInsert}`,
      []
    );

    const td1 = performance.now();
    const startingMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    await raiseEvent({
      type: 'COUNTED',
      version: 1,
    });

    const t1 = performance.now();
    const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const memUsed = endMemory - startingMemory;

    console.log(`Processed 1,000,000 events in ${t1 - td1}ms.`);
    console.log('starting memory', startingMemory);
    console.log('ending memory', endMemory);
    console.log(`Used ${memUsed} MB of memory`);
    expect(reduxStore.getState().count).to.equal(100_001);
    expect(memUsed > 10 && memUsed < 200).to.be.true;
  }).timeout(12000);
  it.skip('consumes ~500 MB processing 1,000,000 events', async () => {
    reduxStore.dispatch({ type: 'RESET' });
    const bulkInsert = Array.from({ length: 1_000_000 })
      .map((_, index) => `(1, 'COUNTED', NULL)`)
      .join(',')
      .replace(/(^,)|(,$)/g, '');
    await pool.query(
      `INSERT INTO "core_domain"."event_store" ("version", "type", "payload") VALUES ${bulkInsert}`,
      []
    );

    const td1 = performance.now();
    const startingMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    await raiseEvent({
      type: 'COUNTED',
      version: 1,
    });

    const t1 = performance.now();
    const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    const memUsed = endMemory - startingMemory;

    console.log(`Processed 1,000,000 events in ${t1 - td1}ms.`);
    console.log('starting memory', startingMemory);
    console.log('ending memory', endMemory);
    console.log(`Used ${memUsed} MB of memory`);
    expect(reduxStore.getState().count).to.equal(1_000_001);
    expect(memUsed > 200 && memUsed < 600).to.be.true;
  }).timeout(120000);
});
