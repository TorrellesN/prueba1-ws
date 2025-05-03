import { z } from "zod";
import { SudokuDraft } from "../sudoku.model/Sudoku";
import { UserLogedSchema, UserLoginDataWRememberSchema, UserRegisterDataSchema, UserSchema } from "../validationSchemas";

/* SCHEMA IMPLEMENTATION */
export type UserLoginData = z.infer<typeof UserLoginDataWRememberSchema>;
export type UserRegisterData = z.infer<typeof UserRegisterDataSchema>;
export type UserLogedData = z.infer<typeof UserLogedSchema>;

export type User = z.infer<typeof UserSchema>;


/* OTHER USER TYPES */

export type Player = Pick<User, 'username' | 'profileImg' | 'email'> & {rol: RolNumber, comboAcc?: number, points?: number};

export type RolNumber = 0 | 1 | 2 | 3 | 4;