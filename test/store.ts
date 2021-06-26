import { createStore, Reducer } from 'redux';

type State = {count: number};

type CountAction = {
  type: 'COUNTED';
};

const initalState: State = {
  count: 0,
};

const countReducer: Reducer<State, CountAction> = (state = initalState, event) => {
  switch (event.type) {
    case 'COUNTED':
      return {
        count: state.count + 1,
      }
    default:
      return state;
  }
}

export const reduxStore = createStore(countReducer);