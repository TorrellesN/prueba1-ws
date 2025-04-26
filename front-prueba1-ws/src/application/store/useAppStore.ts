import { create } from "zustand";
import { AuthStateType, createUserSlice } from "./createUserSlice";
import { devtools } from 'zustand/middleware';
import {  SudokuStateType, createSudokuSlice } from "./createSudokuSlice";

type AppStateType = AuthStateType & SudokuStateType
//se importan los slices para mantener lógica separada
export const useAppStore = create<AppStateType>()(devtools((...a) => ({

    ...createUserSlice(...a),
    ...createSudokuSlice(...a)
})))