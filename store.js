import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

let store

const UserInitialState = {
    Username: 'Null',
    count: 0,
    alltopiccount: {},
}

export const actionTypes = {
    CURRENTUSER: "CURRENTUSER",
    COUNTGLOBAL: "COUNTGLOBAL",
    ALLTOPICCOUNT: "ALLTOPICCOUNT"
}

// REDUCERS
export const reducer = (state = UserInitialState, action) => {
    switch (action.type) {
        case actionTypes.CURRENTUSER:
            return {
                ...state,
                Username: action.payload,
            }
        case actionTypes.COUNTGLOBAL:
            return {
                ...state,
                count: action.payload,
            }
        case actionTypes.ALLTOPICCOUNT:
            return {
                ...state,
                alltopiccount: action.payload
            }
        default:
            return state
    }
}

// ACTIONS
export const ActionCurrentUser = (user) => {
    return { type: actionTypes.CURRENTUSER, payload: user }
}

export const ActionCountTable = (count) => {
    return { type: actionTypes.COUNTGLOBAL, payload: count }
}

export const ActionAllTopicCount = (count_dict) => {
    return {type: actionTypes.ALLTOPICCOUNT, payload: count_dict}
} 

const persistConfig = {
    key: 'primary',
    storage,
    whitelist: ['Username', 'count'], // place to select which state you want to persist
}

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(initialState = UserInitialState) {
    return createStore(
        persistedReducer,
        initialState,
        composeWithDevTools(applyMiddleware())
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? makeStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = makeStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}