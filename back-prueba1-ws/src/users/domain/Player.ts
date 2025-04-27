import User, { UserAuth } from "./User";

export type Player = Pick<User, 'username' | 'profileImg' | 'email'> & {rol: RolNumber, comboAcc?: number, points?: number};
/* export type Participant = {
    player: Player,
    draft?: SudokuDraft
} */
export type RolNumber = 0 | 1 | 2 | 3 | 4;

export const newPlayer = (user: UserAuth, rol: RolNumber): Player => {
    const {username, profileImg, email} = user;
    return {username, profileImg, email, rol, comboAcc: 0, points: 0};
}

/* export const newParticipant = (user: UserAuth | Player, rol?: RolNumber): Participant => {
    const draft: SudokuDraft = Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => [])
      );
    if ('rol' in user) {
        return {
            player: user,
            draft: draft
        }
    } else {
        const {username, profileImg, email} = user;
        return {
            player: {username, profileImg, email, rol: rol ?? 0},
            draft: draft
        }
    }
} */