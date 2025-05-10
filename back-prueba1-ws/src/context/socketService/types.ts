import { SudokuPVP } from "../../sudokus/domain/Sudoku"
import { Player } from "../../users/domain/Player"

export type SocketCallback = (response: { success: boolean, payload: any }) => void
export type SudokuAndPlayer = {
    sudoku: SudokuPVP,
    player: Player
}
export type SavedMoveUseCasesResponse = {
    message: string;
    player: Player;
}