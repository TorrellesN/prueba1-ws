import { UserAuth } from "../../users/domain/User";
import { buildPveBoard, CellToInsert, Difficulty, SudokuPVE } from "../domain/Sudoku";
import { createSudokuGame, SudokuResult } from "../domain/sudokuGenerator";
import SudokuRepository from '../domain/sudoku.repository';

export default class SudokuUseCases {
    constructor(private readonly sudokuRepository : SudokuRepository){};
    
    
    async createPve(user: UserAuth, difficulty: Difficulty): Promise<SudokuPVE> {
        
        const sudokuGenerated: SudokuPVE =  buildPveBoard(user, difficulty);
        const id =  await this.sudokuRepository.insertSudokuPve(sudokuGenerated);
        sudokuGenerated.id = id;
        return sudokuGenerated;
    };

    async insertSudokuPveMove(sudokuId: string, cellToInsert: CellToInsert, pointsForSaving: number): Promise<string> {
        const sudoku: SudokuPVE = await this.sudokuRepository.insertSudokuPveMove(sudokuId, cellToInsert, pointsForSaving);
        if (sudoku.emptyCellsCount === 0 ) return "partida terminada";
        return "movimiento guardado";
    };
}