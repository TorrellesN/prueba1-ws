import React, { createContext, useCallback, useEffect, useState } from "react";
import { useJwt } from "react-jwt";
import { User } from "../../domain/";

//!ESTADO DE USER PASADO A ZUSTAND
type UserContextProps = {
    user: User,
    token: string | null,
    setToken: React.Dispatch<React.SetStateAction<string | null>>,
    setUser: React.Dispatch<React.SetStateAction<User>>
    loginFake: (name: string) => void,
    logout: () => void
}

export const UserContext = createContext<UserContextProps>(null!)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const initialState = {
        username: '',
        email: '',
        profileImg: ''
    }
    const [user, setUser] = useState<User>(initialState)
    const [token, setToken] = useState<string | null>(null)

    const updateToken = (callbackReEvaluate: (token: string) => void, newToken: string) => {
        callbackReEvaluate(newToken); // decodedToken and isExpired will be updated
    }

    const initializeAuth = () => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            const { decodedToken, isExpired, reEvaluateToken } = useJwt(storedToken);

            if (!isExpired) {
                setToken(storedToken);
                const decodedTokenOb = decodedToken as User;
                setUser({
                    username: decodedTokenOb.username,
                    email: decodedTokenOb.email,
                    profileImg: decodedTokenOb.profileImg
                })
            } else {
                updateToken(reEvaluateToken, 'token a actualizar')
            }
        }
    }



    const loginFake = (name: string) => {
        if (name) setUser({
            ...user,
            username: name
        })
    }

    //uso useCallback porque lo voy a usar en el useEffect
    const verifyToken = useCallback(() => { }, [])

    const logout = () => {
        setUser(initialState);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    }


    useEffect(() => {
        initializeAuth();

        // para sincronizar entre pestañas
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'authToken' || e.key === 'authUser') {
                initializeAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{

            logout,
            user,
            setUser,
            token,
            setToken,
            loginFake
        }}>

            {children}
        </UserContext.Provider>
    )

}