import { UserAuth } from "../../users/domain/User";
import { buildPveBoard, CellToInsert, Difficulty, SudokuPVE } from "../domain/Sudoku";
import { createSudokuGame, SudokuResult } from "../domain/sudokuGenerator";
import SudokuRepository from '../domain/sudoku.repository';
import { RolNumber } from "../../users/domain/Player";

export default class SudokuUseCases {
    constructor(private readonly sudokuRepository: SudokuRepository) { };


    async createPve(user: UserAuth, difficulty: Difficulty): Promise<SudokuPVE> {

        const sudokuGenerated: SudokuPVE = buildPveBoard(user, difficulty);
        const id = await this.sudokuRepository.insertSudokuPve(sudokuGenerated);
        sudokuGenerated.id = id;
        return sudokuGenerated;
    };

    async insertSudokuMovePve(sudokuId: string, cellToInsert: CellToInsert, pointsForSaving: number): Promise<string> {
        const sudoku: SudokuPVE = await this.sudokuRepository.insertSudokuMovePve(sudokuId, cellToInsert, pointsForSaving);
        if (sudoku.emptyCellsCount === 0) return "partida terminada";
        return "movimiento guardado";
    };


    async resetComboPve(sudokuId: string): Promise<boolean> {
        return await this.sudokuRepository.resetComboPve(sudokuId);
    }

    async finishGamePve(sudokuId: string): Promise<boolean> {
        return await this.sudokuRepository.finishGamePve(sudokuId);
    }

    async leaveGamePve(sudokuId: string): Promise<boolean> {
        return await this.sudokuRepository.leaveGamePve(sudokuId);
    }

    async getSudokuByIdPve(sudokuId: string): Promise<SudokuPVE> {
        return await this.sudokuRepository.getSudokuByIdPve(sudokuId);
    }

    async finishNow(sudokuId: string): Promise<boolean> {
        return await this.sudokuRepository.finishNow(sudokuId);
    }
    

}