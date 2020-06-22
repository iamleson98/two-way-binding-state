"use strict";
exports.__esModule = true;
function createAsyncStore(reducer, initialState) {
    var state = initialState;
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
        reducer(state, { type: type, value: value, options: options })
            .then(function (data) {
            var success = data.success, result = data.result;
            if (success) {
                if (setStateCalback) {
                    state = result;
                    setStateCalback(state);
                }
            }
            else {
                console.warn(result);
            }
        })["catch"](console.warn);
    }
    return {
        getState: getState,
        dispatch: dispatch
    };
}
exports.createAsyncStore = createAsyncStore;
