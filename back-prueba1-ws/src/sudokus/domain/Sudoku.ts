import { Player } from "../../users/domain/User";

export default interface Sudoku {
    id: string,
    currentSudoku: [][],
    solvedSudoku: [][],
    difficulty: Difficulty,
    status: SudokuStatus,
    creationDate: Date,
    players: [
        player: Player,
        playerDraft: [][]
    ]
}


//aspectos a tener en cuenta: isPrivate


export type Difficulty = "easy" | "medium" | "hard";
export type SudokuStatus = "notStarted" | "started" | "finished";