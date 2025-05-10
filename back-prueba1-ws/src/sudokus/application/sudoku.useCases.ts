import { UserAuth } from "../../users/domain/User";
import { buildPveBoard, buildPvpBoard, CellToInsert, Difficulty, SudokuPVE, SudokuPVP } from "../domain/Sudoku";
import SudokuRepository from '../domain/sudoku.repository';
import { Player } from "../../users/domain/Player";
import { SavedMoveUseCasesResponse, SudokuAndPlayer } from "../../context/socketService/types";

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

    async createPvp(user: UserAuth, difficulty: Difficulty): Promise<SudokuAndPlayer> {

        const sudokuGenerated: SudokuPVP = buildPvpBoard(user, difficulty);
        const id = await this.sudokuRepository.insertSudokuPvp(sudokuGenerated);
        sudokuGenerated.id = id;
        return { sudoku: sudokuGenerated, player: { ...user, rol: 1 } };
    };

    async findRoomsPvp(diff: Difficulty): Promise<string[]> {
        return await this.sudokuRepository.findRoomsPvp(diff);
    }

    async joinUserToSudokuPvp(user: UserAuth, sudokuId: string, difficulty: Difficulty): Promise<SudokuAndPlayer> {
        return await this.sudokuRepository.joinUserToSudokuPvp(user, sudokuId, difficulty);
    }

    async quitUserFromSudokuPvp(email: string, sudokuId: string, difficulty: Difficulty): Promise<boolean> {
        return await this.sudokuRepository.quitUserFromSudokuPvp(email, sudokuId, difficulty);
    }

    async startGamePvp(sudokuId: string, difficulty: Difficulty): Promise<boolean> {
        return await this.sudokuRepository.startGamePvp(sudokuId, difficulty);
    }

    
    async insertSudokuMovePvp(sudokuId: string,  difficulty: Difficulty, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SavedMoveUseCasesResponse> {
        const sudoku: SudokuPVP = await this.sudokuRepository.insertSudokuMovePvp(sudokuId, difficulty, cellToInsert, pointsForSaving);
        const player: Player = sudoku.players.find((player: Player) => player.rol === cellToInsert.rol) as Player;
        
        if (sudoku.emptyCellsCount === 0) return {message: "partida terminada", player};
        return {message : "movimiento guardado", player};
    };

}