import { createStore, Reducer } from 'redux';
import { EventBase } from '../lib';
import { eventStoreReduxEnhancer } from '../src/enhancer';

export type State = {
  count: number
};

export interface CountEvent extends EventBase {
  type: 'COUNTED';
};

const initalState: State = {
  count: 0,
};

const countReducer: Reducer<State, CountEvent> = (state = initalState, event) => {
  switch (event.type) {
    case 'COUNTED':
      return {
        count: state.count + 1,
      }
    default:
      return state;
  }
}

export const reduxStore = createStore(countReducer, initalState, eventStoreReduxEnhancer);