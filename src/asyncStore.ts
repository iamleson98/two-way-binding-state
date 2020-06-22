import {
    AsyncStoreReducer,
    BaseStoreReturn, AsyncStoreDispatchParam
} from './type';


export function createAsyncStore(reducer: AsyncStoreReducer, initialState: any): BaseStoreReturn {

    let state: any = initialState;

    function getState(keys?: string[]): any {
        let neededState: any
        if (keys && !!keys.length) {
            for (let key of keys) {
                neededState[key] = state[key];
            }
        } else {
            neededState = state;
        }
        return neededState;
    }

    function dispatch({ type, value, setStateCalback, options }: AsyncStoreDispatchParam): void {
        reducer(state, { type, value, options })
            .then(data => {
                const { success, result } = data;
                if (success) {
                    if (setStateCalback) {
                        state = result;
                        setStateCalback(state);
                    }
                } else {
                    console.warn(result);
                }
            })
            .catch(console.warn);
    }

    return {
        getState,
        dispatch
    }
}
