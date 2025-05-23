import { SudokuPVE, CellToInsert, Difficulty, SudokuPVP } from "./Sudoku";
import User, { UserAuth } from '../../users/domain/User';
import { Player, RolNumber } from "../../users/domain/Player";
import { SudokuAndPlayer } from "../../context/socketService/types";

export default interface SudokuRepository {
    insertSudokuPve (newSudoku: SudokuPVE): Promise<string>,
    insertSudokuMovePve (sudokuId: string, cellToInsertPvp: CellToInsert, pointsForSaving: number): Promise<SudokuPVE>,
    resetComboPve (sudokuId: string): Promise<boolean>,
    finishGamePve (sudokuId: string): Promise<boolean>,
    leaveGamePve(sudokuId: string): Promise<boolean>,
    getSudokuByIdPve(sudokuId: string): Promise<SudokuPVE>,
    /* getSudokuByIdPvp(sudokuId: string, difficulty: Difficulty, email: User['email']): Promise<SudokuPVP>, */
    finishNow(sudokuId: string): Promise<boolean>,
    findRoomsPvp(diff: Difficulty): Promise<string[]>,
    insertSudokuPvp (newSudoku: SudokuPVP): Promise<string>,
    getSudokuByIdPvp(sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP>,
    joinUserToSudokuPvp(user: UserAuth, sudokuId: string, difficulty: Difficulty): Promise<SudokuAndPlayer>,
    quitUserFromPvpAwait(email: string, sudokuId: string, difficulty: Difficulty): Promise<boolean>,
    quitUserPvpStarted(email: string, sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP>
    startGamePvp(sudokuId: string, difficulty: Difficulty): Promise<boolean>,
    insertSudokuMovePvp(sudokuId: string, difficulty: Difficulty, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SudokuPVP>,
    resetComboPvp (sudokuId: string, difficulty: Difficulty, email: string): Promise<boolean>,
    finishGamePvp (sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP>,
}