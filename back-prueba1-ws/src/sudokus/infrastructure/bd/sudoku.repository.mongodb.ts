import { collections } from '../../../context/db/mongodb.connection';
import { SudokuPVE } from '../../domain/Sudoku';
import SudokuRepository from '../../domain/sudoku.repository';
export default class SudokuRepositoryMongoDB implements SudokuRepository {
    async insertSudokuPve(newSudoku: SudokuPVE): Promise<string> {
        const result = await collections.pveSudoku.insertOne(newSudoku);
        if (!result || !result.acknowledged) throw new Error ('404');
        return String(result.insertedId);
    }
}