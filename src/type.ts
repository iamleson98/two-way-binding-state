export interface ReducerResult {
    success: boolean;
    result: any;
}

export interface ReducerActionParam {
    type: string;
    value?: any;
    options?: any;
}

export interface BaseDispatchParam extends ReducerActionParam { }

export interface AsyncStoreDispatchParam extends BaseDispatchParam {
    setStateCalback?: CallableFunction;
}

export type AsyncStoreReducer = (
    state: any,
    action: ReducerActionParam
) => Promise<ReducerResult>;

export type Reducer = <T>(
    state: T,
    action: ReducerActionParam
) => ReducerResult;

export interface BaseStoreReturn {
    dispatch: (param: AsyncStoreDispatchParam) => void;
    getState: (keys?: string[]) => any;
}

export interface DelayStoreReturn extends BaseStoreReturn {
    unsubscribe: () => void;
}

export interface MultiBindingStoreReturn {
    subscribe: (key: string, setStateCallback: CallableFunction) => void;
    unsubscribe: (key: string) => void;
    dispatch: (param: MultiBindingDispatchParam) => void;
    getState: (keys?: string[]) => any;
}

export interface MultiBindingDispatchParam extends BaseDispatchParam {
    reload: boolean;
}
