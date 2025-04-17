import React, { createContext, useState } from "react"

type UserContextProps = {
    user: {username: string}
    loginFake: (name: string) => void
}

//TODO: lo mejor es que el user en un futuro se almacene en zustand para manejar jwt y la lógica del login
export const UserContext = createContext<UserContextProps>(null!)

export const UserProvider = ({children} : {children: React.ReactNode}) => {
    const initialState = {username: ''}
    const [user, setUser] = useState(initialState)

    const loginFake = (name: string) => {
        if (name) setUser({username: name})
    }

    return (
        <UserContext.Provider value={{
            user,
            loginFake
        }}>

            {children}
        </UserContext.Provider>
    )

}