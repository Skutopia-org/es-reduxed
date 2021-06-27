"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventStoreReduxEnhancer = void 0;
var eventStoreReduxEnhancer = function (createStore) {
    return function (reducer, initialState) {
        var enhancedReducer = function (state, action) {
            if (action.id) {
                /*
                Some redux actions may be internal rather than events raised by the user.
                We need to ensure we only update the last event id for events that have an id, and pass thru for redux actions
                 */
                return __assign(__assign({}, reducer(state, action)), { eventStoreMetadata: {
                        lastEventId: action.id,
                    } });
            }
            return __assign(__assign({}, reducer(state, action)), { eventStoreMetadata: {
                    // @ts-ignore
                    lastEventId: state && state.eventStoreMetadata && state.eventStoreMetadata.lastEventId || 0,
                } });
        };
        return createStore(enhancedReducer, initialState);
    };
};
exports.eventStoreReduxEnhancer = eventStoreReduxEnhancer;
