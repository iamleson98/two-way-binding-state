import { DelayStoreReturn, Reducer, AsyncStoreDispatchParam } from './type';
import { timer, Observable, Subscription } from 'rxjs';


// const timerObservable = timer(0);

export function createDelayStore(reducer: Reducer, initialState: any, timeout: number = 0): DelayStoreReturn {
    const timerObsv = timer(Math.abs(timeout));
    let state: any = initialState;
    let subscription: Subscription;

    /**
     * @param keys - contains strings to help get specific state values.
     */
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
        subscription = timerObsv.subscribe(() => {
            const { success, result } = reducer(state, { type, value, options });
            if (success) {
                state = result;
                if (setStateCalback) {
                    setStateCalback(result);
                }
            } else {
                console.warn(result);
            }
        });
    }

    /**
     * explicitly call this function inside useEffect() return to prevent memory leak.
     */
    function unsubscribe(): void {
        if (subscription instanceof Subscription && !subscription.closed) {
            subscription.unsubscribe();
        }
    }

    return {
        dispatch,
        getState,
        unsubscribe
    }
}
