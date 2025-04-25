import { StateCreator } from "zustand";
import { Difficulty, User, UserLogedData, PlayerSudokuBoard, SudokuBoardSolved, SudokuStatus, Participant } from "../types";

export type PVESudokuStateType = {
  id?: string,
  current: PlayerSudokuBoard,
  solved: SudokuBoardSolved,
  status: SudokuStatus,
  createdAt?: Date,
  participants?: Participant[]

  difficulty: Difficulty,
  setDifficulty: (diff: Difficulty) => void

}


//SLICE USER
export const createSudokuSlice: StateCreator<PVESudokuStateType> = (set, get, api) => ({
  difficulty: "medium",
  current: null[][],

  setDifficulty: (diff: Difficulty) => {
    set({difficulty: diff})
  }

})




