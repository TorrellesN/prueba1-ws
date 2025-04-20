import { create } from "zustand";
import { AuthStateType, createUserSlice } from "./createUserSlice";
import { devtools } from 'zustand/middleware';


//se importan los slices para mantener lógica separada
export const useAppStore = create<AuthStateType>()(devtools((...a) => ({

    ...createUserSlice(...a)
})))