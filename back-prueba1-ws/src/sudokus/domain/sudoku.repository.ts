import { SudokuPVE } from "./Sudoku";

export default interface SudokuRepository {
    insertSudokuPve (newSudoku: SudokuPVE): Promise<string> 
}