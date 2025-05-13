import { Difficulty } from "../../sudokus/domain/Sudoku";
import User, { UserAuth } from "./User";

export default interface UserRepository {

    register (usuario: User) : Promise<string>,
    login (usuario: User) : Promise<User>,
    finishPvpWinGame(usuario: UserAuth, difficulty: Difficulty, sudokoins: number): Promise<number>,
    finishPvpLoseGame(usuario: UserAuth, difficulty: Difficulty, sudokoins: number): Promise<number>,
}