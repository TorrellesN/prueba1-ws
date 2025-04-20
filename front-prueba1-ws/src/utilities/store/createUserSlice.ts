import { StateCreator } from "zustand";
import { User, UserLogedData } from "../types";
import { useJwt } from "react-jwt";

export type AuthStateType = {
    user: User,
    token: string | null,
    isInitialized: boolean,
    setLoginProps: (userLoged: UserLogedData) => void,
    logout: () => void,
    initializeAuth: () => Promise<void>
    // setToken: React.Dispatch<React.SetStateAction<string | null>>,
    // setUser: React.Dispatch<React.SetStateAction<User>>
/*     loginFake: (name: string) => void,
    logout: () => void */
}

const userInitialState = {
    username: '',
    email: '',
    profileImg: ''
}

const updateToken = (callbackReEvaluate: (token: string) => void, newToken: string) => {
    callbackReEvaluate(newToken); // decodedToken and isExpired will be updated
}


//SLICE USER
export const createUserSlice : StateCreator<AuthStateType> = (set, get, api) => ({
user: userInitialState,
token: null,
isInitialized: false,

setLoginProps: (userLoged : UserLogedData) => {
    set((state) => ({
        token: userLoged.token,
        user: userLoged.user
    }))
},

logout: () => {
    set(({
        token: '',
        user: userInitialState
    }))
},
initializeAuth: async () => {
    const storedToken = localStorage.getItem('authToken');
    
    if (!storedToken) {
      set({ isInitialized: true });
      return;
    }

    const { decodedToken, isExpired, reEvaluateToken } = useJwt(storedToken);

    if (!isExpired && decodedToken) {
      const decodedUser = decodedToken as User;
      set({
        token: storedToken,
        user: {
          username: decodedUser.username,
          email: decodedUser.email,
          profileImg: decodedUser.profileImg
        },
        isInitialized: true
      });
    } else {
      try {
        //TODO: logica peticion renovar token:
        // const newToken = await refreshToken(storedToken);
        updateToken(reEvaluateToken, ' ');
        set({
          token: ' ',
          isInitialized: true
        });
      } catch (error) {
        localStorage.removeItem('authToken');
        set({
          token: null,
          user: userInitialState,
          isInitialized: true
        });
      }
    }
  }
})




// Función auxiliar para refrescar el token (ejemplo)
/* async function refreshToken(oldToken: string): Promise<string> {
    // Implementa tu lógica de renovación de token aquí
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oldToken}`
      }
    });
    const data = await response.json();
    return data.token;
  } */