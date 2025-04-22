import { StateCreator } from "zustand";
import { Difficulty, User, UserLogedData } from "../types";

export type PVESudokuStateType = {
  difficulty: Difficulty,
  setDifficulty: (diff: Difficulty) => void

}

const userInitialState = {
  username: '',
  email: '',
  profileImg: ''
}


//SLICE USER
export const createPVESudokuSlice: StateCreator<PVESudokuStateType> = (set, get, api) => ({
  difficulty: "easy",

  setDifficulty: (diff: Difficulty) => {
    set({difficulty: diff})
  }

})




