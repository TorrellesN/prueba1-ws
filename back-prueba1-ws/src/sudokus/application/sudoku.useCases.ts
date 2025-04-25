import { newParticipant, Player } from '../../users/domain/Player';
import { UserAuth } from "../../users/domain/User";
import { buildPveBoard, Difficulty, SudokuPVE } from "../domain/Sudoku";
import { createSudokuGame, SudokuResult } from "../domain/sudokuGenerator";
import SudokuRepository from '../domain/sudoku.repository';

export default class SudokuUseCases {
    constructor(private readonly sudokuRepository : SudokuRepository){};
    
    
    async createPve(user: UserAuth, difficulty: Difficulty): Promise<SudokuPVE> {
        
        const sudokuGenerated: SudokuPVE =  buildPveBoard(user, difficulty);
        const id =  await this.sudokuRepository.insertSudokuPve(sudokuGenerated);
        sudokuGenerated.id = id;
        return sudokuGenerated;
    }
}