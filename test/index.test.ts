import { expect } from 'chai';
import { tinyFixtures } from 'tiny-fixtures';
import { initialiseEventSourcingSystem } from '../src';
import { createPostresEventStoreProvider } from '../src/postgres';
import { pool, poolConfig } from './db';
import { CountEvent, reduxStore } from './store';
import { Pool } from 'pg';

const { createFixtures } = tinyFixtures(new Pool(poolConfig));

describe('redux with psql provider', () => {
  const [setupFixtures, teardownFixtures] = createFixtures('core_domain.event_store', [
    {
      type: 'COUNTED',
      version: 1,
    }
  ])
  beforeEach(async () => {
    await setupFixtures();
  });
  afterEach(async () => {
    await teardownFixtures();
  })
  it('does the docs', async () => {
    const provider = createPostresEventStoreProvider<CountEvent>({
      eventSchema: 'core_domain',
      poolConfig,
    });

    const { raiseEvent } = await initialiseEventSourcingSystem<ReturnType<(typeof reduxStore.getState)>, CountEvent>({
      reduxStore,
      eventStoreProvider: provider,
    });
    const state = reduxStore.getState();
    expect(state.count).to.equal(1);

    const newState = await raiseEvent({ type: 'COUNTED', version: 1, payload: {}});
    expect(newState.count).to.equal(2);
    await pool.query(`DELETE FROM core_domain.event_store WHERE id = $1`, [newState.eventStoreMetadata.lastEventId]);
  });
});
