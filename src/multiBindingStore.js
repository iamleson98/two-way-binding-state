"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
function createMultiBindingStore(reducer, initialState) {
    var state = initialState;
    var subject = new rxjs_1.Subject();
    var subjectSubscriptionMap = new Map();
    function subscribe(key, setStateCallback) {
        var newSub = subject.subscribe({
            next: function (data) { return setStateCallback(data); }
        });
        subjectSubscriptionMap.set(key, newSub);
    }
    /**
     * @param keys string list to let store know which state to return
     */
    function getState(keys) {
        var neededState;
        if (!keys) {
            neededState = state;
        }
        else {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                neededState[key] = state[key] || null;
            }
        }
        return neededState;
    }
    /**
     * explicitly call this function inside useEffect() return to prevent memory leak.
     */
    function unsubscribe(key) {
        var _a;
        (_a = subjectSubscriptionMap.get(key)) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        subjectSubscriptionMap["delete"](key);
    }
    function dispatch(_a) {
        var type = _a.type, reload = _a.reload, value = _a.value, options = _a.options;
        var _b = reducer(state, { type: type, value: value, options: options }), success = _b.success, result = _b.result;
        if (success) {
            state = result;
            if (reload) {
                subject.next(state);
            }
        }
        else {
            console.warn(result);
        }
    }
    return {
        getState: getState,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        dispatch: dispatch
    };
}
exports.createMultiBindingStore = createMultiBindingStore;
