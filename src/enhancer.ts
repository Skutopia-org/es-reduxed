import {
  AnyAction,
  PreloadedState,
  Reducer,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
} from 'redux';
import { EventStoreBase } from './index';

export const eventStoreReduxEnhancer: StoreEnhancer<any, EventStoreBase> =
  (createStore: StoreEnhancerStoreCreator) =>
  <S, E extends AnyAction>(
    reducer: Reducer<S, E>,
    initialState?: PreloadedState<S>
  ) => {
    const enhancedReducer: Reducer<S, E> = (state, action) => {
      if (action.id) {
        /*
      Some redux actions may be internal rather than events raised by the user.
      We need to ensure we only update the last event id for events that have an id, and pass thru for redux actions
       */
        return {
          ...reducer(state, action),
          eventStoreMetadata: {
            lastEventId: action.id,
          },
        };
      }
      return {
        ...reducer(state, action),
        eventStoreMetadata: {
          // @ts-ignore
          lastEventId: state?.eventStoreMetadata?.lastEventId || 0,
        },
      };
    };
    return createStore(enhancedReducer, initialState);
  };
