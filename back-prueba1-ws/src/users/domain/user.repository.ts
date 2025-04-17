import User from "./User";

export default interface UserRepository {

    register (usuario: User) : Promise<string>,
    login (usuario: User) : Promise<User>,

}