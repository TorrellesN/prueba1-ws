import { newParticipant, Participant, Player, RolNumber } from '../../users/domain/Player';
import User from '../../users/domain/User';
import { createSudokuGame } from './sudokuGenerator';


/* export default interface s {
    ids: string,
    currentSudoku: [][],
    solvedSudoku: [][],
    difficulty: Difficulty,
    status: SudokuStatus,
    creationDate: Date,
    players: [
        player: Player,
        playerDraft: [][]
    ]
} */

export type SudokuPVP = {
    id?: string,
    current: FormattedSudokuBoard,
    solved: SudokuBoardSolved,
    difficulty: Difficulty,
    status: SudokuStatus,
    createdAt?: Date,
    participants: Participant[]
}

export type SudokuPVE = Omit<SudokuPVP, 'participants'> & {participant: Participant};

/* SECONDARY TYPES */
type Cell = { row: number; col: number; value: number | null };
type CellToInsert = { row: number; col: number; value: number, rol: RolNumber };
type SudokuBoard = (number | null)[][];
type SudokuBoardSolved = number[][];
type FormattedCell = { rol: RolNumber; number: number } | null;
type FormattedSudokuBoard = FormattedCell[][];
type DraftCell = number[]; 
type SudokuDraft = DraftCell[][]; 

/* ENUMS */
type Difficulty = "easy" | "medium" | "hard";
type SudokuStatus = "new" | "started" | "finished";

export {Cell, SudokuBoard, SudokuBoardSolved, FormattedCell,
    FormattedSudokuBoard, SudokuDraft, Difficulty, SudokuStatus}

//aspectos a tener en cuenta: isPrivate
//refinar el playerDraft, añadiendo un enum o regex de los numeros aceptados

/* INITIALIZE METHODS */
export const buildPveBoard =  (user: User, difficulty: Difficulty): SudokuPVE => {
    const {current, solved} =  createSudokuGame(difficulty);
    //TODO: almacenar fecha correctamente
    return {
        current,
        solved,
        difficulty,
        status: 'new',
        createdAt: new Date(),
        participant: newParticipant(user, 1)
    }
}

//para desarrollo
function printMatrixNumbers(matrix: SudokuPVE['current']) {
    for (let i = 0; i < matrix.length; i++) {
      let row = matrix[i];
      let numbers= row.map(obj => obj === null ? 'x' : obj.number).join('  ');
      console.log(numbers);
    }
  } 



