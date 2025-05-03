import { StateCreator } from "zustand";
import { Difficulty, PlayerSudokuBoard, SudokuBoardSolved, SudokuStatus, Player, initialPVESudoku, SudokuPVE, SudokuPVP, CellToInsert, pointsPerCell, RolNumber } from "../../domain/";

export type SudokuStateType = {
  id?: string,
  current: PlayerSudokuBoard,
  solved: SudokuBoardSolved,
  status: SudokuStatus,
  createdAt?: Date,
  players?: Player[]
  difficulty: Difficulty,
  comboAcc: number,
  points: number,
  rol: RolNumber | null,
  setInnitialSudokuState: (sudoku: SudokuPVE | SudokuPVP) => void,
  setStartedSudokuState: (sudoku: SudokuPVE | SudokuPVP) => void,
  restartSudokuState: () => void,
  calculatePoints: () => number,
  isCorrectNumber: (number: number, row: number, col: number) => boolean,
  savePVEMove: (cellToInsert: CellToInsert, calculatedPoints: number) => void,
  resetCombo: () => void,
  fillEmptyCells: () => void
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
  rol: null,



  //TODO: para cuando haga pvp cambiar la condicional de participants?
  setInnitialSudokuState: (sudoku: SudokuPVE | SudokuPVP) => {
    localStorage.setItem('sudokuRoom', sudoku.id!)
    set({
      id: sudoku.id,
      current: sudoku.current,
      solved: sudoku.solved,
      status: 'started',
      players: 'players' in sudoku ? sudoku.players : [],
      difficulty: sudoku.difficulty,
      comboAcc: 0,
      points: 0
    })
    if (!('players' in sudoku)) {
      set({ rol: 1 });
    }
  },

  setStartedSudokuState: (sudoku: SudokuPVE | SudokuPVP) => {
    localStorage.setItem('sudokuRoom', sudoku.id!)
    set({
      id: sudoku.id,
      current: sudoku.current,
      solved: sudoku.solved,
      status: 'started',
      players: 'players' in sudoku ? sudoku.players : [],
      difficulty: sudoku.difficulty,

    })
    //TODO: por el momento usar api para recoger algo del otro slice, más tarde implementar bien zustand
    const { email } = api.getState() as any;

    if (!('players' in sudoku) && 'player' in sudoku) {
      set({
        comboAcc: sudoku.player?.comboAcc || 0,
        points: sudoku.player?.points || 0,
        rol: 1
      })
    } else if ('players' in sudoku) {
      const player = sudoku.players.find((player: Player) => player.email === email)
      set({
        comboAcc: player?.comboAcc || 0,
        points: player?.points || 0,
        rol: 1
      })
    }
  },


  restartSudokuState: () => {
    set({
      id: '',
      current: initialPVESudoku.current,
      solved: initialPVESudoku.solved,
      status: 'started',
      players: [],
      difficulty: initialPVESudoku.difficulty,
      comboAcc: 0,
      points: 0
    })
    localStorage.removeItem('sudokuRoom');
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
      return false;
    }
  },

  resetCombo: () => {
    set({ comboAcc: 0 })
  },

  savePVEMove: (cellToInsert: CellToInsert, calculatedPoints: number) => {
    const { current } = get();
    const { row, col, value } = cellToInsert;
    const newCurrent = [...current];
    newCurrent[row][col] = { value, rol: 1 };

    set((state) => ({
      ...state,
      current: newCurrent,
      points: calculatedPoints,
      comboAcc: state.comboAcc >= 10 ? 10 : state.comboAcc + 1
    }))

  },


  fillEmptyCells: () => {
    const rol = 0;

    const { current, solved } = get();
    const newCurrent = current;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (current[row][col] === null) {
          newCurrent[row][col] = { rol: rol, value: solved[row][col] };

        }
      }
    }

    newCurrent[0][0] = null;
    set({
      current: newCurrent
    })
  }

})



/* setRol: (rol: RolNumber) => {
  set({ rol: rol });
} */
