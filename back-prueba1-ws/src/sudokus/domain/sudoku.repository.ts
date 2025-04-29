import { SudokuPVE, CellToInsert } from "./Sudoku";
import { UserAuth } from '../../users/domain/User';
import { RolNumber } from "../../users/domain/Player";

export default interface SudokuRepository {
    insertSudokuPve (newSudoku: SudokuPVE): Promise<string>,
    insertSudokuMovePve (sudokuId: string, cellToInsertPvp: CellToInsert, pointsForSaving: number): Promise<SudokuPVE>,
    resetComboPve (sudokuId: string): Promise<boolean>,
    finishGamePve (sudokuId: string): Promise<boolean>,
    leaveGamePve(sudokuId: string): Promise<boolean>
}