import { create } from "zustand";
import { AuthStateType, createUserSlice } from "./createUserSlice";
import { devtools } from 'zustand/middleware';
import { createPVESudokuSlice, PVESudokuStateType } from "./createOnePSudokuSlice";

type AppStateType = AuthStateType & PVESudokuStateType
//se importan los slices para mantener lógica separada
export const useAppStore = create<AppStateType>()(devtools((...a) => ({

    ...createUserSlice(...a),
    ...createPVESudokuSlice(...a)
})))