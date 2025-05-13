import { UserAuth } from "../../users/domain/User";
import { buildPveBoard, buildPvpBoard, CellToInsert, Difficulty, getSudoKoinsByDifficulty, SudokuPVE, SudokuPVP } from "../domain/Sudoku";
import SudokuRepository from '../domain/sudoku.repository';
import { Player, RolNumber } from "../../users/domain/Player";
import { SavedMoveUseCasesResponse, SudokuAndPlayer, SudokuPvpResolvedResponse } from "../../context/socketService/types";
import UserRepository from "../../users/domain/user.repository";

export default class SudokuUseCases {
    constructor(private readonly sudokuRepository: SudokuRepository, private readonly userRepository: UserRepository) { };


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

    async quitUserFromPvpAwait(email: string, sudokuId: string, difficulty: Difficulty): Promise<boolean> {
        return await this.sudokuRepository.quitUserFromPvpAwait(email, sudokuId, difficulty);
    }

    async startGamePvp(sudokuId: string, difficulty: Difficulty): Promise<boolean> {
        return await this.sudokuRepository.startGamePvp(sudokuId, difficulty);
    }


    async insertSudokuMovePvp(sudokuId: string, difficulty: Difficulty, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SavedMoveUseCasesResponse> {
        const sudoku: SudokuPVP = await this.sudokuRepository.insertSudokuMovePvp(sudokuId, difficulty, cellToInsert, pointsForSaving);
        const player: Player = sudoku.players.find((player: Player) => player.rol === cellToInsert.rol) as Player;

        if (sudoku.emptyCellsCount === 0) return { message: "partida terminada", player };
        return { message: "movimiento guardado", player };
    };

    async resetComboPvp(sudokuId: string, difficulty: Difficulty, email: string): Promise<boolean> {
        return await this.sudokuRepository.resetComboPvp(sudokuId, difficulty, email);
    }

    async quitUserAndCheckVictory(email: string, sudokuId: string, difficulty: Difficulty): Promise<string> {
        const sudoku = await this.sudokuRepository.quitUserPvpStarted(email, sudokuId, difficulty);
        if (sudoku.players.length === 1) return "partida terminada";
        else return "jugador eliminado";
    }

    async getSudokuByIdPvp(sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP> {
        return await this.sudokuRepository.getSudokuByIdPvp(sudokuId, difficulty);
    }



    async finishGamePvp(sudokuId: string, difficulty: Difficulty): Promise<SudokuPvpResolvedResponse> {
        const sudokuResolved: SudokuPVP = await this.sudokuRepository.getSudokuByIdPvp(sudokuId, difficulty);

        /* const sudokoinsSaved: { rol: RolNumber, sudokoins: number, win: boolean }[] = [] */

        const sudokoinsSaved: Promise<{ rol: RolNumber, sudokoins: number, win: boolean }>[] = sudokuResolved.players.map(
            async (player: Player) => {
                const { email, username } = player;
                const user: UserAuth = { email, username };
                const win = sudokuResolved.players.every((p: Player) => (p.points || 0) <= (player.points || 0))
                const sudokoins = getSudoKoinsByDifficulty(difficulty, win);
                
                if (win) {
                    await this.userRepository.finishPvpWinGame(user, difficulty, sudokoins);
                    /* return { ...user, points: player.points, rol: player.rol }; */
                } else {
                    await this.userRepository.finishPvpLoseGame(user, difficulty, sudokoins);
                }
                return {rol: player.rol, sudokoins, win};
            });

        const resolvedSudokoins = await Promise.all(sudokoinsSaved);
        await this.sudokuRepository.finishGamePvp(sudokuId, difficulty);
        const sudokuFinishedResponse: SudokuPvpResolvedResponse = {
            sudokuSolved: sudokuResolved.current,
            players: sudokuResolved.players,
            playersSudokoins: resolvedSudokoins,
            createdAt: sudokuResolved.createdAt,
        }
        return sudokuFinishedResponse;
    }

}

