import { z } from 'zod'

export const UserRegisterDataSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener más de 3 caracteres").max(20, "El nombre de usuario no puede tener más de 20 caracteres"),
  email: z.string().min(1, "Campo requerido").email("Email no válido"),
  pwd: z.string().min(8, "Debe tener mínimo 8 caracteres"),
  pwdRep: z.string()
}).refine(data => data.pwd === data.pwdRep, {
  message: "Las contraseñas no coinciden",
  path: ["pwdRep"]
})


export const UserLoginDataSchema = z.object({
  email: z.string().min(1, "Campo requerido"),
  pwd: z.string().min(1, "Campo requerido")
})

export const UserLoginDataWRememberSchema = UserLoginDataSchema.extend({
  rememberme: z.boolean(),
});

export const UserSchema = z.object({
  username: z.string(),
  email: z.string(),
  profileImg: z.string()

})

export const UserLogedSchema = z.object({
  user: UserSchema,
  token: z.string()
})


export type UserLoginData = z.infer<typeof UserLoginDataWRememberSchema>;
export type UserRegisterData = z.infer<typeof UserRegisterDataSchema>;
export type UserLogedData = z.infer<typeof UserLogedSchema>;
export type User = z.infer<typeof UserSchema>;


/* OTHER USER TYPES */

export type Player = Pick<User, 'username' | 'profileImg' | 'email'> & {rol: RolNumber};
export type Participant = {
    player: Player,
    draft?: SudokuDraft
}
export type RolNumber = 0 | 1 | 2 | 3 | 4;


/* SUDOKU */

export type Difficulty = "easy" | "medium" | "hard";
export type SudokuStatus = "new" | "started" | "finished";
export const diffOptions: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

function getKeyByValue(obj: Record<string, string>, value: string): string | undefined {
  return Object.entries(obj).find(([key, val]) => val === value)?.[0];
}


export type Cell = { row: number; col: number; value: number | null };
export type CellToInsert = { row: number; col: number; value: number, rol: RolNumber };
export type SudokuBoardSolved = number[][];
export type PlayerCell = { rol: RolNumber; number: number } | null;
export type PlayerSudokuBoard = PlayerCell[][];
export type DraftCell = number[]; 
export type SudokuDraft = DraftCell[][]; 

export type SudokuPVP = {
  id?: string,
  current: PlayerSudokuBoard,
  solved: SudokuBoardSolved,
  difficulty: Difficulty,
  status: SudokuStatus,
  createdAt?: Date,
  participants: Participant[]
}

export type SudokuPVE = Omit<SudokuPVP, 'participants'> & {participant: Participant};
