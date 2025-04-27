import { StateCreator } from "zustand";
import { Difficulty, PlayerSudokuBoard, SudokuBoardSolved, SudokuStatus, Participant, initialPVESudoku, SudokuPVE, SudokuPVP, CellToInsert, pointsPerCell } from "../../domain/";
import { toast } from "react-toastify";

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
  calculatePoints: () => number,
  isCorrectNumber: (number: number, row: number, col: number) => boolean,
  savePVEMove: (cellToInsert: CellToInsert, calculatedPoints: number) => void
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
  },


  calculatePoints: () => {
    const { comboAcc, points } = get();
    if (comboAcc >= 10) {
      return points + pointsPerCell + (10 * 2);
    }
    return points + pointsPerCell + (comboAcc * 2);
  },

  isCorrectNumber: (number: number, row: number, col: number) => {

    if (number === get().solved[row][col]) {
      return true;
    } else {
      toast.error('Número incorrecto');
      return false;
    }
  },

  savePVEMove: (cellToInsert: CellToInsert, calculatedPoints: number) => {
    const { current } = get();
    const { row, col, value } = cellToInsert;
    const newCurrent = [...current];
    newCurrent[row][col] = {value, rol: 1};

      set((state) => ({
        ...state,
        current: newCurrent,
        points: calculatedPoints,
        comboAcc: state.comboAcc >= 10 ? 10 : state.comboAcc + 1
      }))
    
  }





})




