import { compare, hash } from "../../context/security/encrypter";
import User, { UserAuth } from "../domain/User";
import UserRepository from "../domain/user.repository";

export default class UserUseCases {

    constructor (private readonly userRepository : UserRepository) {}

    async register (user: User) : Promise<string> {
        if (user.pwd) {
            user.pwd = hash(user.pwd)
        } else {
            throw new Error ('500')
        }
        return await this.userRepository.register(user);
    }

    async login (user: User) : Promise<UserAuth> {
        if (!user.email || !user.pwd) throw new Error ('401');

        const userDB: User = await this.userRepository.login(user);
        
        const confirmLogin = await compare(user.pwd, userDB.pwd || '');
        if (!confirmLogin) throw new Error('401');
        
        const userLoged: UserAuth = userDB
        return userLoged;
    }
}