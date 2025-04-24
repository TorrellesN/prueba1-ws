import { newParticipant, Player } from '../../users/domain/Player';
import { UserAuth } from "../../users/domain/User";
import { buildPveBoard, Difficulty, SudokuPVE } from "../domain/Sudoku";
import { createSudokuGame, SudokuResult } from "../domain/sudokuGenerator";
import SudokuRepository from '../domain/sudoku.repository';

export default class SudokuUseCases {
    private sudokuRepository : SudokuRepository;
    constructor(sudokuRepository : SudokuRepository){
        this.sudokuRepository = sudokuRepository;
    };
    
    
    async createPve(user: UserAuth, difficulty: Difficulty): Promise<SudokuPVE> {
        
        const sudokuGenerated: SudokuPVE =  buildPveBoard(user, difficulty);
        return await this.sudokuRepository.insertSudokuPve(sudokuGenerated);
    }
}