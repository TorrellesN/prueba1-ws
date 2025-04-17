export default interface User {
    username ?: string,
    email: string,
    pwd ?: string,
    photo ?: string
}

export type UserAuth = Pick<User, 'username' | 'photo' | 'email'>