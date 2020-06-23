import { useReducer, useContext, createContext } from 'react'

const UserDispatchContext = createContext()
const UserStateContext = createContext()

const reducer = (state, action) => {
    switch (action.type) {
        case 'AddUser':
            return action.payload;
        default:
            throw new Error(`Unknown action: ${action.type}`)
    }

}

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, 0)
    return (
        <UserDispatchContext.Provider value={dispatch}>
            <UserStateContext.Provider value={state}>
                {children}
            </UserStateContext.Provider>
        </UserDispatchContext.Provider>
    )
}

export const useStateUser = () => useContext(UserStateContext);
export const useDispatchUser = () => useContext(UserDispatchContext);