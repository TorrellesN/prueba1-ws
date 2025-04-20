import React, { createContext, useCallback, useState } from "react"
import { loginService } from "../../services/api/authService"
import { ApiState, User, UserLogedData, UserLoginData } from "../types"
import { useApiRequest } from "../hooks/useApiRequest"

type UserContextProps = {
    user: { username: string },
    setUser: React.Dispatch<React.SetStateAction<User>>
    loginFake: (name: string) => void,
    register: (email: string, pwd: string) => void
    logout: () => void
}

//TODO: lo mejor es que el user en un futuro se almacene en zustand para manejar jwt y la lógica del login
export const UserContext = createContext<UserContextProps>(null!)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const initialState = {
        username: '',
        email: '',
        profileImg: ''
    }
    const [user, setUser] = useState(initialState)

    const loginFake = (name: string) => {
        if (name) setUser({
            ...user,
            username: name
        })
    }

/*     const login = async (data: UserLoginData): Promise<ApiState<UserLogedData>> => {
        const { email, pwd } = data;
        const { loading, error } = useApiRequest(() => loginService({ email, pwd }))

        if (data.rememberme) {
            localStorage.setItem('userLogin', JSON.stringify({
                email: data.email,
                pwd: data.pwd
            }))
        } else {
            localStorage.removeItem('userLogin')
        }

        return { loading, error };
    } */

    const register = (email: string, pwd: string) => {

    }

    //uso useCallback porque lo voy a usar en el useEffect
    const verifyToken = useCallback(() => { }, [])

    const logout = () => { }

    return (
        <UserContext.Provider value={{
            
            register,
            logout,
            user,
            setUser,
            loginFake
        }}>

            {children}
        </UserContext.Provider>
    )

}