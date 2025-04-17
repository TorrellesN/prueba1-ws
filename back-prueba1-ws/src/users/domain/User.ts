export default interface User {
    username ?: string,
    email: string,
    pwd ?: string,
    profileImg ?: string
}

export type UserAuth = Pick<User, 'username' | 'profileImg' | 'email'>