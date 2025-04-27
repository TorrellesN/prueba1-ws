import { ObjectId } from 'mongodb';
import { collections } from '../../../context/db/mongodb.connection';
import { CellToInsert, SudokuPVE } from '../../domain/Sudoku';
import SudokuRepository from '../../domain/sudoku.repository';

export default class SudokuRepositoryMongoDB implements SudokuRepository {
    
    
    async insertSudokuPve(newSudoku: SudokuPVE): Promise<string> {
        const result = await collections.pveSudoku.insertOne(newSudoku);
        if (!result || !result.acknowledged) throw new Error('404');
        return String(result.insertedId);
    };


    async insertSudokuPveMove(sudokuId: string, cellToInsert: CellToInsert, pointsForSaving: number): Promise<SudokuPVE> {
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
}