import { CellDraft } from "../../sudokus/domain/Sudoku";
import User, { UserAuth } from "./User";

export type Player = Pick<User, 'username' | 'profileImg' | 'email'> & {rol: RolNumber};
export type Participant = {
    player: Player,
    draft?: CellDraft[]
}
export type RolNumber = 0 | 1 | 2 | 3 | 4;

export const newPlayer = (user: UserAuth, rol: RolNumber): Player => {
    const {username, profileImg, email} = user;
    return {username, profileImg, email, rol}
}

export const newParticipant = (user: UserAuth | Player, rol?: RolNumber): Participant => {
    if ('rol' in user) {
        return {
            player: user,
            draft: []
        }
    } else {
        const {username, profileImg, email} = user;
        return {
            player: {username, profileImg, email, rol: rol ?? 0},
            draft: []
        }
    }
}