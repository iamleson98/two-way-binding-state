import { ReducerActionParam, ReducerResult } from '../type'
import { createMultiBindingStore } from '../multiBindingStore'
import React, { useState, useEffect } from 'react'


const TYPE__SET_NAME = "TYPE__SET_NAME", TYPE__SET_AGE = "TYPE__SET_NAME"

interface State {
    name: string;
    age: number;
}

const initialState: State = {
    name: "",
    age: 0
}

const reducer = (state: any, { type, options, value }: ReducerActionParam): ReducerResult => {
    let newState: any;

    switch (type) {
        case TYPE__SET_NAME:
            newState = { ...state, name: value }
            break
        case TYPE__SET_AGE:
            newState = { ...state, age: value }
            break

        default:
            break
    }

    return {
        success: !!newState ? true : false,
        result: newState
    }
}

const store = createMultiBindingStore(reducer, initialState)

const AgeSetter = () => {

    const handleAgeChange = (evt) => {
        const { value } = evt.target
        store.dispatch({
            type: TYPE__SET_AGE,
            value,
            reload: true // reload decide whether to reload <Display /> or not.
        })
    }

    return (
        <div>
            <input type="number" onChange={handleAgeChange} />
        </div>
    )
}


const NameSetter = () => {

    const handleAgeChange = (evt) => {
        const { value } = evt.target
        store.dispatch({
            type: TYPE__SET_NAME,
            value,
            reload: true // reload decide whether to reload <Display /> or not.
        })
    }

    return (
        <div>
            <input type="text" onChange={handleAgeChange} />
        </div>
    )
}

const Display = () => {

    const [state, setState] = useState(store.getState())
    const { age, name } = state

    useEffect(() => {
        // subscribe to store:
        store.subscribe(Display.name, setState) // pass function name to subscribe to make unsubscribe operation easier

        return () => {
            store.unsubscribe(Display.name)
        }
    }, [])

    return (
        <div>
            {age}
            {name}
        </div>
    )
}

export default () => {
    return (
        <div>
            <AgeSetter />
            <NameSetter />
            <Display />
        </div>
    )
}
