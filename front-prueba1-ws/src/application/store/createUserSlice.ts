import { StateCreator } from "zustand";
import { User, UserLogedData } from "../../domain";
import { RolNumber } from "../../domain";

export type AuthStateType = {
  user: User,
  token: string | null,
  rol: RolNumber | null,
  setLoginState: (userLoged: UserLogedData) => void,
  logout: () => void,
  /* setToken: (newToken: string) => void */

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

//TODO: reimplementar método de refrescar token
const updateToken = (callbackReEvaluate: (token: string) => void, newToken: string) => {
  callbackReEvaluate(newToken); // actualiza las props decodedToken y isExpired
}


//SLICE USER
export const createUserSlice: StateCreator<AuthStateType> = (set, get, api) => ({
  user: userInitialState,
  token: null,
  rol: null,


  setLoginState: (userLoged: UserLogedData) => {

    set((state) => ({
      token: userLoged.token,
      user: userLoged.user
    }))
    localStorage.setItem('token', userLoged.token)

  },



  logout: () => {
    set(({
      token: '',
      user: userInitialState
    }))
    localStorage.removeItem('token')
  },

  /* setToken: (newToken: string) => {
    set({ token: newToken });
  }, */

  setRol: (rol: RolNumber) => {
    set({ rol: rol });
  }

})


