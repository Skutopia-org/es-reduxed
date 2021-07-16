import { createStore, Reducer } from 'redux';
import { EventBase } from '../lib';
import { eventStoreReduxEnhancer } from '../src/enhancer';

export type State = {
  count: number
  largeMessage: string;
};

export interface CountEvent extends EventBase {
  type: 'COUNTED';
  largeMessage: string;
};

export interface LargeMessageEvent extends EventBase {
  type: 'LARGE_MESSAGE';
  payload: { msg: string };
}

const initalState: State = {
  count: 0,
  largeMessage: '',
};

export type Events = CountEvent | LargeMessageEvent;

const countReducer: Reducer<State, Events> = (state = initalState, event) => {
  switch (event.type) {
    case 'COUNTED':
      return {
        ...state,
        count: state.count + 1,
      }
    case 'LARGE_MESSAGE': {
      return {
        ...state,
        largeMessage: event.payload.msg,
      }
    }
    default:
      return state;
  }
}

export const reduxStore = createStore(countReducer, initalState, eventStoreReduxEnhancer);