import { SudokuPVP } from "../../sudokus/domain/Sudoku"
import { Player, RolNumber } from "../../users/domain/Player"

export type SocketCallback = (response: { success: boolean, payload: any }) => void
export type SudokuAndPlayer = {
    sudoku: SudokuPVP,
    player: Player
}
export type SavedMoveUseCasesResponse = {
    message: string;
    player: Player;
}
export type SudokuPvpResolvedResponse = {
    sudokuSolved: SudokuPVP['current']
    players: Player[];
    playersSudokoins: { rol: RolNumber, sudokoins: number, win: boolean }[];
    createdAt?: Date,
}