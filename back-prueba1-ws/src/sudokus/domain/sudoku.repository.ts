import { SudokuPVE, CellToInsert } from "./Sudoku";

export default interface SudokuRepository {
    insertSudokuPve (newSudoku: SudokuPVE): Promise<string>,
    insertSudokuPveMove (sudokuId: string, cellToInsertPvp: CellToInsert, pointsForSaving: number): Promise<SudokuPVE>, 
    
}