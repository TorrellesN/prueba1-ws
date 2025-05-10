import { SudokuPVE, CellToInsert, Difficulty, SudokuPVP } from "./Sudoku";
import { UserAuth } from '../../users/domain/User';
import { RolNumber } from "../../users/domain/Player";
import { SudokuAndPlayer } from "../../context/socketService/types";

export default interface SudokuRepository {
    insertSudokuPve (newSudoku: SudokuPVE): Promise<string>,
    insertSudokuMovePve (sudokuId: string, cellToInsertPvp: CellToInsert, pointsForSaving: number): Promise<SudokuPVE>,
    resetComboPve (sudokuId: string): Promise<boolean>,
    finishGamePve (sudokuId: string): Promise<boolean>,
    leaveGamePve(sudokuId: string): Promise<boolean>,
    getSudokuByIdPve(sudokuId: string): Promise<SudokuPVE>,
    finishNow(sudokuId: string): Promise<boolean>,
    findRoomsPvp(diff: Difficulty): Promise<string[]>,
    insertSudokuPvp (newSudoku: SudokuPVP): Promise<string>,
    getSudokuByIdPvp(sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP>,
    joinUserToSudokuPvp(user: UserAuth, sudokuId: string, difficulty: Difficulty): Promise<SudokuAndPlayer>,
    quitUserFromSudokuPvp(email: string, sudokuId: string, difficulty: Difficulty): Promise<boolean>,
    startGamePvp(sudokuId: string, difficulty: Difficulty): Promise<boolean>,
    insertSudokuMovePvp(sudokuId: string, difficulty: Difficulty, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SudokuPVP>,

}