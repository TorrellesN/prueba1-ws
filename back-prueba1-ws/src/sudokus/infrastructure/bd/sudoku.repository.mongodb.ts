import { ObjectId } from 'mongodb';
import { collections } from '../../../context/db/mongodb.connection';
import { CellToInsert, SudokuPVE } from '../../domain/Sudoku';
import SudokuRepository from '../../domain/sudoku.repository';
import { RolNumber } from '../../../users/domain/Player';

export default class SudokuRepositoryMongoDB implements SudokuRepository {
    
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
}