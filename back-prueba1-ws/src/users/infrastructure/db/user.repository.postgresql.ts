import executeQuery from "../../../context/db/postgres.connector";
import { Difficulty } from "../../../sudokus/domain/Sudoku";
import User, { UserAuth } from "../../domain/User";
import UserRepository from "../../domain/user.repository";

export default class UserRepositoryPostgreSQL implements UserRepository {

    async register(user: User): Promise<string> {
        console.log(user)
        try {
            const query = 'INSERT INTO users ("email", "pwd", "username") VALUES ($1, $2, $3) RETURNING *;';
            const rows: any[] = await executeQuery(query, [user.email, user.pwd, user.username]);
            if (rows.length <= 0 || rows[0].email !== user.email) throw new Error('503');

            return "ok";
        } catch (e) {
            throw new Error('409')
        }
    }


    async login(user: User): Promise<User> {
        const query = 'SELECT * FROM users WHERE email = $1;'
        const rows: any[] = await executeQuery(query, [user.email]);
        if (rows.length <= 0) throw new Error('401');

        const { email, pwd, username, profile_img } = rows[0];
        const userDB: User = {
            email, pwd, username, profileImg: profile_img
        }
        return userDB;
    }


    async finishPvpWinGame(usuario: UserAuth, difficulty: Difficulty, sudokoins: number): Promise<number> {
        const diffQuery: string = difficulty + '_wins'
        const query = `UPDATE users SET sudokoins = sudokoins + $1, ${diffQuery} = ${diffQuery} + 1, total_played = total_played + 1 WHERE email = $2 RETURNING sudokoins;`;
        const rows: any[] = await executeQuery(query, [sudokoins, usuario.email]);
        if (rows.length <= 0) throw new Error('503');
        return rows[0].sudokoins;
    }


    async finishPvpLoseGame(usuario: UserAuth, difficulty: Difficulty, sudokoins: number): Promise<number> {
        const query = `UPDATE users SET sudokoins = sudokoins + $1, total_played = total_played + 1 WHERE email = $2 RETURNING sudokoins;`;
        const rows: any[] = await executeQuery(query, [sudokoins, usuario.email]);
        if (rows.length <= 0) throw new Error('503');
        return rows[0].sudokoins;
    }
}