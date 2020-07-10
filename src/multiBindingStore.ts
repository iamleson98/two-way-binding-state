import { Subject, Subscription } from "rxjs";
import {
    Reducer,
    MultiBindingDispatchParam,
    MultiBindingStoreReturn,
} from "./type";

export function createMultiBindingStore(
    reducer: Reducer,
    initialState: any
): MultiBindingStoreReturn {

    let state: any = initialState;
    const subject = new Subject();
    const subjectSubscriptionMap = new Map<string, Subscription>();

    function subscribe(key: string, setStateCallback: CallableFunction): void {
        const newSub = subject.subscribe({
            next: (data: any) => setStateCallback(data)
        });
        subjectSubscriptionMap.set(key, newSub);
    }

    /**
     * @param keys string array to let store know which parts of state to return
     */
    function getState(keys?: string[]): any {
        let neededState: any;

        if (!keys) {
            neededState = state;
        } else {
            for (let key of keys) {
                neededState[key] = state[key] || null;
            }
        }

        return neededState;
    }

    /**
     * explicitly call this function inside useEffect() return to prevent memory leak.
     */
    function unsubscribe(key: string): void {
        subjectSubscriptionMap.get(key)?.unsubscribe();
        subjectSubscriptionMap.delete(key);
    }

    function dispatch({
        type,
        reload,
        value,
        options
    }: MultiBindingDispatchParam): void {
        const { success, result } = reducer(state, { type, value, options });
        if (success) {
            state = result;
            if (reload) {
                subject.next(state);
            }
        } else {
            console.warn(result);
        }
    }

    return {
        getState,
        subscribe,
        unsubscribe,
        dispatch
    };
}
