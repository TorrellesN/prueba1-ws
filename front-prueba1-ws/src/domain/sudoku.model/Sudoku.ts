import { Player, RolNumber } from "../user.model/UserModel";

export type Difficulty = "easy" | "medium" | "hard";
export type SudokuStatus = "started" | "finished";
export const diffOptions: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};


export type Cell = { row: number; col: number; value: number | null };
export type CellToInsert = { row: number; col: number; value: number, rol?: RolNumber };
export type SudokuBoardSolved = number[][];
export type PlayerCell = { rol: RolNumber; value: number } | null;
export type PlayerSudokuBoard = PlayerCell[][];
export type DraftCell = number[]; 
export type SudokuDraft = DraftCell[][]; 

export interface SudokuPVP {
  id?: string,
  current: PlayerSudokuBoard,
  solved: SudokuBoardSolved,
  difficulty: Difficulty,
  status: SudokuStatus,
  createdAt?: Date,
  players: Player[]
}

export interface SudokuPVE extends Omit<SudokuPVP, 'players'> {player?: Player}

