import { StateCreator } from "zustand";
import { User, UserLogedData } from "../types";

export type AuthStateType = {
  user: User,
  token: string | null,
  setLoginState: (userLoged: UserLogedData) => void,
  logout: () => void,
  setToken: (newToken: string) => void

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
  callbackReEvaluate(newToken); // actualiza las props decodedToken y isExpired
}


//SLICE USER
export const createUserSlice: StateCreator<AuthStateType> = (set, get, api) => ({
  user: userInitialState,
  token: null,



  setLoginState: (userLoged: UserLogedData) => {

    set((state) => ({
      token: userLoged.token,
      user: userLoged.user
    }))
    localStorage.setItem('token', userLoged.token)

  },


  /* login: async(userLoged: UserLogedData) => {
      
  
      const { dataApi, errorApi, execute } = useApiRequest<UserLogedData>();
      await execute(() => loginService(user));
      if (dataApi) {
        set((state) => ({
          token: dataApi.token,
          user: dataApi.user
      }))
      } else if (errorApi) {
        set ({authError: errorApi})
      }
  
  
      set({isAuthLoading: false})
  
    }, */


  logout: () => {
    set(({
      token: '',
      user: userInitialState
    }))
    localStorage.removeItem('token')
  },

  setToken: (newToken: string) => {
    set({ token: newToken });
  },


  /* initializeAuth: async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        set({ isInitialized: true });
        return;
      }
  
      const { decodedToken, isExpired, reEvaluateToken } = useJwt(storedToken);
      console.log(decodedToken)
  
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
          localStorage.removeItem('token');
          set({
            token: null,
            user: userInitialState,
            isInitialized: true
          });
        }
      }
    }*/
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