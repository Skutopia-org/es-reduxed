import { createStore, Reducer } from 'redux';
import { EventBase } from '../lib';
import { eventStoreReduxEnhancer } from '../src/enhancer';

export type State = {
  count: number;
  largeMessage: string;
};

export interface CountEvent extends EventBase {
  type: 'COUNTED';
}

export interface DivideEvent extends EventBase {
  type: 'DIVIDE_BY';
  payload: number;
}

export interface ResetEvent extends EventBase {
  type: 'RESET';
}

export interface LargeMessageEvent extends EventBase {
  type: 'LARGE_MESSAGE';
  payload: { msg: string };
}

const initalState: State = {
  count: 0,
  largeMessage: '',
};

export type Events = CountEvent | LargeMessageEvent | DivideEvent | ResetEvent;

const countReducer: Reducer<State, Events> = (state = initalState, event) => {
  switch (event.type) {
    case 'COUNTED':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'LARGE_MESSAGE': {
      return {
        ...state,
        largeMessage: event.payload.msg,
      };
    }
    case 'DIVIDE_BY': {
      return {
        ...state,
        count: state.count / event.payload,
      };
    }
    case 'RESET': {
      return {
        ...state,
        count: 0,
      };
    }
    default:
      return state;
  }
};

export const reduxStore = createStore(
  countReducer,
  initalState,
  eventStoreReduxEnhancer
);
