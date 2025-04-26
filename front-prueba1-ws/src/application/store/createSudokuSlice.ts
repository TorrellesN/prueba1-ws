import { StateCreator } from "zustand";
import { Difficulty, PlayerSudokuBoard, SudokuBoardSolved, SudokuStatus, Participant, initialPVESudoku, SudokuPVE, SudokuPVP } from "../../domain/";

export type SudokuStateType = {
  id?: string,
  current: PlayerSudokuBoard,
  solved: SudokuBoardSolved,
  status: SudokuStatus,
  createdAt?: Date,
  participants?: Participant[]
  difficulty: Difficulty,
  comboAcc: number,
  points: number,
  setInnitialSudokuState: (sudoku: SudokuPVE | SudokuPVP) => void,
  setStartedStatus: () => void,
}




export const createSudokuSlice: StateCreator<SudokuStateType> = (set, get, api) => ({
  id: initialPVESudoku.id,
  current: initialPVESudoku.current,
  solved: initialPVESudoku.solved,
  status: initialPVESudoku.status,
  participants: [],
  difficulty: initialPVESudoku.difficulty,
  comboAcc: 0,
  points: 0,



  setInnitialSudokuState: (sudoku: SudokuPVE | SudokuPVP) => {
    set({
      id: sudoku.id,
      current: sudoku.current,
      solved: sudoku.solved,
      status: 'started',
      participants: 'participants' in sudoku ? sudoku.participants : [],
      difficulty: sudoku.difficulty
    })
    if (!('participants' in sudoku)) {
      //TODO: por el momento usar api para recoger algo del otro slice, más tarde implementar bien zustand
      const { setRol } = api.getState() as any;
      if (setRol) {
        setRol(1);
      }
    }
  },


  setStartedStatus: () => {
    set((state) => ({
      ...state,
      status: 'started'
    }))
  }


})




