import React, { useState, useEffect } from 'react';
import { ReducerActionParam, ReducerResult } from '../type'
import { createDelayStore } from '../delayStore'


export interface State {
    count1: number;
}

const initialState = {
    count1: 0,
}

const TYPE__INCR_COUNT_1 = "TYPE__INCR_COUNT_1", TYPE__DECR_COUNT_1 = "TYPE__DECR_COUNT_1";

function reducer(state: any, { type, value, options }: ReducerActionParam): ReducerResult {

    let newState: any;

    switch (type) {
        case TYPE__INCR_COUNT_1:
            newState = { ...state, count1: state.count1 + 1 }
            break;
        case TYPE__DECR_COUNT_1:
            newState = { ...state, count1: state.count1 - 1 }

        default:
            break;
    }

    return {
        success: !!newState ? true : false,
        result: newState
    }
}
/**
 * delay store make it easier to do tasks after period of time, asynchoronously
 */
const delayStore = createDelayStore(reducer, initialState, 0)


function Component() {

    const [state, setState] = useState<State>(delayStore.getState())
    const { count1 } = state

    const handleIncrease = () => {
        delayStore.dispatch({
            type: TYPE__INCR_COUNT_1,
            setStateCalback: setState,
        })
    }

    const handleDecrease = () => {
        delayStore.dispatch({
            type: TYPE__DECR_COUNT_1,
            setStateCalback: setState,
        })
    }

    useEffect(() => {
        return () => {
            delayStore.unsubscribe()
        }
    }, [])

    return (
        <div>
            <button
                onClick={handleIncrease}
            >increase</button>
            <button
                onClick={handleDecrease}
            >increase</button>
            {count1}
        </div>
    )
}
