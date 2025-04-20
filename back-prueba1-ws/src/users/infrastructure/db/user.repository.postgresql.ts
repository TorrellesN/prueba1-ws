import executeQuery from "../../../context/db/postgres.connector";
import User from "../../domain/User";
import UserRepository from "../../domain/user.repository";

export default class UserRepositoryPostgreSQL implements UserRepository {
    
    async register(user: User): Promise<string> {
        console.log(user)
        const query = 'INSERT INTO users ("email", "pwd", "username") VALUES ($1, $2, $3) RETURNING *;';
        const rows: any[] = await executeQuery(query, [user.email, user.pwd, user.username]);
        if (rows.length <= 0 || rows[0].email !== user.email) throw new Error('400');
        
        return "ok"; 
    }


    async login(user: User): Promise<User> {
        const query = 'SELECT * FROM users WHERE email = $1;'
        const rows: any[] = await executeQuery(query, [user.email]);
        if (rows.length <= 0) throw new Error('401');
        
        const {email, pwd, username, profile_img} = rows[0];
        const userDB: User = {
            email, pwd, username, profileImg: profile_img
        }
        return userDB;
    }
}