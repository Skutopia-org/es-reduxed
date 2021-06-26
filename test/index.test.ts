import { expect } from 'chai';
import { tinyFixtures } from 'tiny-fixtures';
import { initialiseEventSourcingSystem } from '../src';
import { createPostresEventStoreProvider } from '../src/postgres';
import { poolConfig } from './db';
import { reduxStore } from './store';
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
    const provider = createPostresEventStoreProvider({
      eventSchema: 'core_domain',
      poolConfig,
    });

    await initialiseEventSourcingSystem({
      reduxStore,
      eventStoreProvider: provider,
    });
    expect(reduxStore.getState().count).to.equal(1);
  });
});
