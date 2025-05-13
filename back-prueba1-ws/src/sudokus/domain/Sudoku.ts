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

export type SudokuPVE = Omit<SudokuPVP, 'players'> & { player?: Player };

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
type SudokuStatus = "new" | "started" | "finished";

const sudoKoinsByDifficulty = {
    'easy': {
        win: 3,
        lose: 1
    },
    'medium': {
        win: 5,
        lose: 2
    },
    'hard': {
        win: 7,
        lose: 3
    }
}

export {
    Cell, Difficulty, FormattedCell, CellToInsert,
    FormattedSudokuBoard, SudokuBoard, SudokuBoardSolved, SudokuStatus
};


/* INITIALIZE METHODS */
export const buildPveBoard = (user: User, difficulty: Difficulty): SudokuPVE => {
    const { current, solved, emptyCellsCount } = createSudokuGame(difficulty);

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

export const buildPvpBoard = (user: User, difficulty: Difficulty): SudokuPVP => {
    const { current, solved, emptyCellsCount } = createSudokuGame(difficulty);
    const players: Player[] = []
    players.push(newPlayer(user, 1));

    return {
        current,
        solved,
        difficulty,
        status: 'new',
        createdAt: new Date(),
        emptyCellsCount,
        players: players,
    }
}


export const getSudoKoinsByDifficulty = (difficulty: Difficulty, win: boolean) => {
    const { win: winKoins, lose: loseKoins } = sudoKoinsByDifficulty[difficulty];
    return win ? winKoins : loseKoins;
}


//para desarrollo
function printMatrixNumbers(matrix: SudokuPVE['current']) {
    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];
        let numbers = row.map(obj => obj === null ? 'x' : obj.value).join('  ');
        console.log(numbers);
    }
}



