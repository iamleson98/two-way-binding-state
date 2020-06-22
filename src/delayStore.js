"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var timerObservable = rxjs_1.timer(0);
function createDelayStore(reducer, initialState, timer) {
    if (timer === void 0) { timer = timerObservable; }
    var state = initialState;
    var subscription;
    /**
     * @param keys - contains strings to help get specific state values.
     */
    function getState(keys) {
        var neededState;
        if (keys && !!keys.length) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                neededState[key] = state[key];
            }
        }
        else {
            neededState = state;
        }
        return neededState;
    }
    function dispatch(_a) {
        var type = _a.type, value = _a.value, setStateCalback = _a.setStateCalback, options = _a.options;
        subscription = timer.subscribe(function () {
            var _a = reducer(state, { type: type, value: value, options: options }), success = _a.success, result = _a.result;
            if (success) {
                state = result;
                if (setStateCalback) {
                    setStateCalback(result);
                }
            }
            else {
                console.warn(result);
            }
        });
    }
    /**
     * explicitly call this function inside useEffect() return to prevent memory leak.
     */
    function unsubscribe() {
        if (subscription instanceof rxjs_1.Subscription && !subscription.closed) {
            subscription.unsubscribe();
        }
    }
    return {
        dispatch: dispatch,
        getState: getState,
        unsubscribe: unsubscribe
    };
}
exports.createDelayStore = createDelayStore;
