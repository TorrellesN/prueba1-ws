export default interface User {
    username ?: string,
    email: string,
    pwd ?: string,
    profileImg ?: string
}

export type UserAuth = Pick<User, 'username' | 'profileImg' | 'email'>;
export type Player = Pick<User, 'username' | 'profileImg' | 'email'> & {rol: RolNumber};
export type RolNumber = 0 | 1 | 2 | 3;

