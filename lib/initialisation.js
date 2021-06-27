"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseEventSourcingSystem = void 0;
var createCheckStateFunc = function (resolve) {
    return function (currentState, eventId, unsubscribe) {
        var lastEventId = currentState.eventStoreMetadata.lastEventId;
        if (lastEventId >= eventId) {
            if (unsubscribe) {
                unsubscribe();
            }
            resolve(currentState);
            return true;
        }
        return false;
    };
};
var withReduxStore = function (saveEvent, reduxStore) { return function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var eventResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, saveEvent(event)];
            case 1:
                eventResult = _a.sent();
                return [2 /*return*/, new Promise(function (resolve) {
                        /*
                        we need to check current state up here too because the event loop may
                        have ticked around and the subscription may run after the event has already
                        been dispatched to redux
                         */
                        var checkStateHasEvent = createCheckStateFunc(resolve);
                        if (!checkStateHasEvent(reduxStore.getState(), eventResult.cursor)) {
                            var unsubscribe_1 = reduxStore.subscribe(function () {
                                checkStateHasEvent(reduxStore.getState(), eventResult.cursor, unsubscribe_1);
                            });
                        }
                    })];
        }
    });
}); }; };
var replayExistingEvents = function (eventsRepo, reduxStore, cursor) {
    if (cursor === void 0) { cursor = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var events, ids, maxId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.info("Replaying events from cursor [" + cursor + "]");
                    return [4 /*yield*/, eventsRepo.getEvents(cursor)];
                case 1:
                    events = _a.sent();
                    ids = events.map(function (e) { return e.id; }).filter(Boolean);
                    maxId = Math.max.apply(Math, __spreadArray(__spreadArray([], ids), [0]));
                    if (maxId === 0) {
                        console.info("Replay completed at cursor [" + cursor + "]");
                        return [2 /*return*/];
                    }
                    events.forEach(function (e) { return reduxStore.dispatch(e); });
                    return [4 /*yield*/, replayExistingEvents(eventsRepo, reduxStore, maxId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
/**
 *
 */
var initialiseEventSourcingSystem = function (_a) {
    var reduxStore = _a.reduxStore, eventStoreProvider = _a.eventStoreProvider;
    return __awaiter(void 0, void 0, void 0, function () {
        var eventsRepo, subscriber, startTime, endTime;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    eventsRepo = eventStoreProvider.eventsRepo, subscriber = eventStoreProvider.subscriber;
                    startTime = new Date();
                    return [4 /*yield*/, replayExistingEvents(eventsRepo, reduxStore, 0)];
                case 1:
                    _b.sent();
                    endTime = new Date();
                    return [4 /*yield*/, subscriber(reduxStore)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, {
                            meta: {
                                replayDuration: endTime.getTime() - startTime.getTime(),
                            },
                            raiseEvent: withReduxStore(eventsRepo.saveEvent, reduxStore),
                        }];
            }
        });
    });
};
exports.initialiseEventSourcingSystem = initialiseEventSourcingSystem;
