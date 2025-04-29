import { newPlayer, Player, RolNumber } from '../../users/domain/Player';
import User from '../../users/domain/User';
import { createSudokuGame } from './sudokuGenerator';


export type SudokuPVP = {
    id?: string,
    current: FormattedSudokuBoard,
    solved: SudokuBoardSolved,
    difficulty: Difficulty,
    status?: SudokuStatus,
    createdAt?: Date,
    emptyCellsCount?: number,
    players: Player[]
}

export type SudokuPVE = Omit<SudokuPVP, 'players'> & {player?: Player};

/* SECONDARY TYPES */
type Cell = { row: number; col: number; value: number | null };
type CellToInsert = { row: number; col: number; value: number, rol?: RolNumber };
type SudokuBoard = (number | null)[][];
type SudokuBoardSolved = number[][];
type FormattedCell = { rol: RolNumber; value: number } | null;
type FormattedSudokuBoard = FormattedCell[][];
/* type DraftCell = number[];  */
/* type SudokuDraft = DraftCell[][];  */

/* ENUMS */
type Difficulty = "easy" | "medium" | "hard";
type SudokuStatus = "started" | "finished";

export {
    Cell, Difficulty, FormattedCell, CellToInsert,
    FormattedSudokuBoard, SudokuBoard, SudokuBoardSolved, SudokuStatus
};

//aspectos a tener en cuenta: isPrivate

/* INITIALIZE METHODS */
export const buildPveBoard =  (user: User, difficulty: Difficulty): SudokuPVE => {
    const {current, solved, emptyCellsCount} =  createSudokuGame(difficulty);
    
    return {
        current,
        solved,
        difficulty,
        status: 'started',
        createdAt: new Date(),
        emptyCellsCount,
        player: newPlayer(user, 1),
    }
}

//para desarrollo
function printMatrixNumbers(matrix: SudokuPVE['current']) {
    for (let i = 0; i < matrix.length; i++) {
      let row = matrix[i];
      let numbers= row.map(obj => obj === null ? 'x' : obj.value).join('  ');
      console.log(numbers);
    }
  } 



