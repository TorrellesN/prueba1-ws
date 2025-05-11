import { ObjectId } from 'mongodb';
import { collections } from '../../../context/db/mongodb.connection';
import { CellToInsert, Difficulty, SudokuPVE, SudokuPVP } from '../../domain/Sudoku';
import SudokuRepository from '../../domain/sudoku.repository';
import { newPlayer, RolNumber } from '../../../users/domain/Player';
import { UserAuth } from '../../../users/domain/User';
import { SudokuAndPlayer } from '../../../context/socketService/types';

export default class SudokuRepositoryMongoDB implements SudokuRepository {
    
    private getMongoPvpCollection = (difficulty: Difficulty) => {
        let collection;
        if (difficulty === 'easy') {
            collection = collections.easyPvpSudoku;
        } else if (difficulty === 'medium') {
            collection = collections.mediumPvpSudoku;
        } else if (difficulty === 'hard') {
            collection = collections.hardPvpSudoku;
        } else {
            collection = collections.pvpSudoku; // default collection if needed
        }
        return collection;
    }

    async insertSudokuPve(newSudoku: SudokuPVE): Promise<string> {
        const result = await collections.pveSudoku.insertOne(newSudoku);
        if (!result || !result.acknowledged) throw new Error('404');
        return String(result.insertedId);
    };


    async insertSudokuMovePve(sudokuId: string, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SudokuPVE> {
        const result = await collections.pveSudoku.findOneAndUpdate(
            {
                 _id: new ObjectId(sudokuId),
                 [`solved.${cellToInsert.row}.${cellToInsert.col}`]: cellToInsert.value,
                 [`current.${cellToInsert.row}.${cellToInsert.col}`]: { $type: 'null' }
                },
            {
                $set: {
                    [`current.${cellToInsert.row}.${cellToInsert.col}`]: { rol: 1, value: cellToInsert.value },
                    [`player.points`]: pointsForSaving
                },
                $inc: {
                    [`player.comboAcc`]: 1,
                    emptyCellsCount: -1
                }
            } as Object,
            { returnDocument: 'after' }
        );

        if ( !result ) throw new Error('404');
        const { current, solved, difficulty, emptyCellsCount } = result;
        const sudokuPve : SudokuPVE= { current, solved, difficulty, emptyCellsCount }; 
        return sudokuPve;
    };


    async resetComboPve(sudokuId: string): Promise<boolean> {
        const result = await collections.pveSudoku.updateOne({_id: new ObjectId(sudokuId)}, {
            $set: {
                [`player.comboAcc`]: 0
            }
        })
        if (result.matchedCount === 0 || result.modifiedCount === 0) return false;
        return true;
    }


    async finishGamePve(sudokuId: string): Promise<boolean> {
        console.log('sudoku',sudokuId);
        
        const result = await collections.pveSudoku.updateOne({_id: new ObjectId(sudokuId)}, {
            $set: {
                status: "finished"
            }
        })

        console.log(result);
        
        if (result.matchedCount === 0 || result.modifiedCount === 0) return false;
        return true;
    }


    async leaveGamePve(sudokuId: string): Promise<boolean> {
        const result = await collections.pveSudoku.deleteOne({_id: new ObjectId(sudokuId)})
        if (!result.acknowledged || result.deletedCount === 0) return false;
        return true;
    }


    async getSudokuByIdPve(sudokuId: string): Promise<SudokuPVE> {
        const result = await collections.pveSudoku.findOne({_id: new ObjectId(sudokuId)});
        if (!result) throw new Error('404');
        const { current, solved, difficulty, emptyCellsCount, player } = result;
        const sudokuPve : SudokuPVE= { current, solved, difficulty, emptyCellsCount, player, id: sudokuId }; 
        return sudokuPve;
    }


    async finishNow(sudokuId: string): Promise<boolean> {
        const result = await collections.pveSudoku.updateOne({_id: new ObjectId(sudokuId)}, {
            $set: {
                emptyCellsCount: 1
            }
        })

        if (result.matchedCount === 0) {
            const resultPvp = await collections.pvpSudoku.updateOne({_id: new ObjectId(sudokuId)}, {
                $set: {
                    emptyCellsCount: 1
                }
            })
            if (resultPvp.matchedCount === 0 || resultPvp.modifiedCount === 0) return false;
        }
        return true;
    }


    async findRoomsPvp(difficulty: Difficulty): Promise<string[]> {
        // Use conditional logic to access the correct collection based on difficulty
        const collection = this.getMongoPvpCollection(difficulty);
        
        const salasDisponibles = await collection.find({
            status: 'new',
            'players.3': { $exists: false } // Menos de 4 jugadores
        }).toArray();
        if (!salasDisponibles || salasDisponibles.length === 0) throw new Error('404');
        const ids = salasDisponibles.map((sala) => sala._id.toString());
        return ids;
    }


    async insertSudokuPvp(newSudoku: SudokuPVP): Promise<string> {
        const collection = this.getMongoPvpCollection(newSudoku.difficulty);
        const result = await collection.insertOne(newSudoku);
        if (!result || !result.acknowledged) throw new Error('404');
        return String(result.insertedId);
    }


    async getSudokuByIdPvp(sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP> {
        const collection = this.getMongoPvpCollection(difficulty);
        const result = await collection.findOne({_id: new ObjectId(sudokuId)});
        if (!result) throw new Error('404');
        const { current, solved, emptyCellsCount, players } = result;
        const sudokuPvp : SudokuPVP= { current, solved, difficulty, emptyCellsCount, players, id: sudokuId }; 
        return sudokuPvp;
    }


    async joinUserToSudokuPvp(user: UserAuth, sudokuId: string, difficulty: Difficulty): Promise<SudokuAndPlayer> {
        const collection = this.getMongoPvpCollection(difficulty);
        const resultSudokuObj = await this.getSudokuByIdPvp(sudokuId, difficulty);
        
        const numberOfPlayers = resultSudokuObj.players.length;
        if (numberOfPlayers >= 4) throw new Error('409');
        
        const rols: RolNumber[] = [1, 2, 3, 4];
        const takenRols = resultSudokuObj.players.map(player => player.rol);
        const freeRols = rols.filter(rol => !takenRols.includes(rol));
        const player =  newPlayer(user, freeRols[0] );

        const result = await collection.updateOne(
            { _id: new ObjectId(sudokuId) },
            {
                $push: {
                    players: player
                }
            } as Object,
        );

        if (!result || !result.acknowledged) throw new Error('404');
        return { sudoku: resultSudokuObj, player }; 
    }


    async quitUserFromPvpAwait(email: string, sudokuId: string, difficulty: Difficulty): Promise<boolean> {
        const collection = this.getMongoPvpCollection(difficulty);
        const result = await collection.updateOne(
            { _id: new ObjectId(sudokuId) },
            {
                $pull: {
                   players: { email: email }
                }
            } as Object,
        );

        if (result.matchedCount === 0 || result.modifiedCount === 0) return false;
        return true;
    }


        async quitUserPvpStarted(email: string, sudokuId: string, difficulty: Difficulty): Promise<SudokuPVP> {
        const collection = this.getMongoPvpCollection(difficulty);
        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(sudokuId) },
            {
                $pull: {
                   players: { email: email }
                }
            } as Object,
            {returnDocument: 'after' }
        );
        if (!result) throw new Error('404');
                const { current, solved, emptyCellsCount, players } = result;
        const sudokuPvp : SudokuPVP= { current, solved, difficulty, emptyCellsCount, players }; 
        return sudokuPvp;
    }


    async startGamePvp(sudokuId: string, difficulty: Difficulty): Promise<boolean> {
        const collection = this.getMongoPvpCollection(difficulty);
        const realTime = new Date();
        
        const result = await collection.updateOne(
            { _id: new ObjectId(sudokuId) },
            {
                $set: {
                    status: 'started',
                    createdAt: realTime
                }
            } as Object,
        )
        
        if (result.matchedCount === 0 || result.modifiedCount === 0) return false;
        return true;
    };


    async insertSudokuMovePvp(sudokuId: string, difficulty: Difficulty, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SudokuPVP> {
        const collection = this.getMongoPvpCollection(difficulty);

        const result = await collection.findOneAndUpdate(
            {
                _id: new ObjectId(sudokuId),
                [`solved.${cellToInsert.row}.${cellToInsert.col}`]: cellToInsert.value,
                [`current.${cellToInsert.row}.${cellToInsert.col}`]: { $type: 'null' }
            },
            {
                $set: {
                    [`current.${cellToInsert.row}.${cellToInsert.col}`]: { rol: cellToInsert.rol, value: cellToInsert.value },
                    [`players.$[elem].points`]: pointsForSaving
                },
                $inc: {
                    [`players.$[elem].comboAcc`]: 1,
                    emptyCellsCount: -1
                }
            } as Object,
            { 
                arrayFilters: [{ 'elem.rol': cellToInsert.rol }],
                returnDocument: 'after' 
            }
        );

        if ( !result ) throw new Error('404');
        const { current, solved, emptyCellsCount, players } = result;
        const sudokuPvp : SudokuPVP= { current, solved, difficulty, emptyCellsCount, players }; 
        return sudokuPvp;
    }


    async resetComboPvp(sudokuId: string, difficulty: Difficulty, email: string): Promise<boolean> {
        const collection = this.getMongoPvpCollection(difficulty);
        
        const result = await collection.updateOne(
            { _id: new ObjectId(sudokuId) },
            {
                $set: {
                    [`players.$[elem].comboAcc`]: 0
                }
            } as Object,
            { arrayFilters: [{ 'elem.email': email }] }
        );

        if (result.matchedCount === 0 || result.modifiedCount === 0) return false;
        return true;
    }



}


