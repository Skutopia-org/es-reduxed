"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventStoreReduxEnhancer = void 0;
const eventStoreReduxEnhancer = (createStore) => (reducer, initialState) => {
    const enhancedReducer = (state, action) => {
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
exports.eventStoreReduxEnhancer = eventStoreReduxEnhancer;
