import { getQueue } from '../src/queue';
import { reduxStore } from './store';
import { memoryEventsRepo } from './memoryDb';
import { expect } from 'chai';

describe('event dispatch queue', () => {
  it('should process an event', async () => {
    const { enqueue, registerPromise } = getQueue(reduxStore, memoryEventsRepo);
    const {
      event: { id },
    } = await memoryEventsRepo.saveEvent({
      type: 'COUNTED',
      version: 1,
    });
    if (!id) {
      throw new Error('No id from saved event');
    }
    const p = new Promise((resolve) => {
      registerPromise(id, resolve);
    });
    enqueue(id);
    await p;
    expect(reduxStore.getState().count).to.eq(1);
  });
  it('should correctly process multiple events received out of order', async () => {
    const { enqueue, registerPromise } = getQueue(reduxStore, memoryEventsRepo);
    const {
      event: { id: id1 },
    } = await memoryEventsRepo.saveEvent({
      type: 'COUNTED',
      version: 1,
    });
    const {
      event: { id: id2 },
    } = await memoryEventsRepo.saveEvent({
      type: 'DIVIDE_BY',
      payload: 2,
      version: 1,
    });
    const {
      event: { id: id3 },
    } = await memoryEventsRepo.saveEvent({
      type: 'COUNTED',
      version: 1,
    });
    if (!id1 || !id2 || !id3) {
      throw new Error('Undefined event id');
    }
    const p1 = new Promise((resolve) => {
      registerPromise(id1, resolve);
    });
    const p2 = new Promise((resolve) => {
      registerPromise(id2, resolve);
    });
    const p3 = new Promise((resolve) => {
      registerPromise(id3, resolve);
    });
    enqueue(id2);
    enqueue(id1);
    enqueue(id3);
    await p3;

    expect(reduxStore.getState().count).to.eq(2);
  });
});
