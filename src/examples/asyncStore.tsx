import React, { useState } from 'react';
import { createAsyncStore } from '../asyncStore';
import { ReducerActionParam, ReducerResult } from '../type';
import { Promise } from 'es6-promise';


/**
 * 
 * this store should be used if your reducer function need to perform some asynchronous tasks such as
 * network fetching(fetch, XmlHttpRequest, loading script URL from cdn, ...) 
 */

const initialState = {
    numOfFollowers: 0
}

interface SampleData {
    followers: number;
    other: any;
}

const TYPE__FETCH = "TYPE__FETCH";

function reducer(state: any, { type, value, options }: ReducerActionParam): Promise<ReducerResult> {
    return new Promise((resolve: CallableFunction, reject: CallableFunction) => {
        const fakeJsonLink = "https://sitename.com/jsonData";

        // suppose this fetch operation takes a few seconds to finish.
        fetch(fakeJsonLink, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => {
                return data.json();
            })
            .then((parsedResult: SampleData) => {
                const { followers } = parsedResult;
                resolve({
                    success: true,
                    result: followers
                });
            })
            .catch(e => {
                reject(e);
            });
    });
}

const asyncStore = createAsyncStore(reducer, initialState);

interface State {
    followers: number;
}

function Component() {

    const [state, setState] = useState<State>(asyncStore.getState());
    const { followers } = state;

    const handleFetch = () => {
        asyncStore.dispatch({
            type: TYPE__FETCH,
            setStateCalback: setState // this means after reducer finishing fetch operation, setState will be invoked, store update its state, component rerender
        })
    }

    return (
        <div>
            <button
                onClick={handleFetch}
            >Fetch followers</button>
            {followers}
        </div>
    )
}

