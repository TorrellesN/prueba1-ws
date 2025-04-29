import { DraftCell, PlayerSudokuBoard, SudokuBoardSolved, SudokuDraft, SudokuPVE, SudokuPVP } from "./Sudoku";

export const generateEmptyPlayerBoard = (): PlayerSudokuBoard => {
    return Array(9).fill(null).map(() => Array(9).fill(null));
  };
  
  export const generateSolvedBoardWithOnes = (): SudokuBoardSolved => {
    return Array(9).fill(null).map(() => Array(9).fill(1));
  };
  
  export const initialPVESudoku: SudokuPVE = {
    id: '',
    current: generateEmptyPlayerBoard(),
    solved: generateSolvedBoardWithOnes(),
    difficulty: "easy",
    status: "started"
  };
  
  export const initialPVPSudoku: SudokuPVP = {
    id: '',
    current: generateEmptyPlayerBoard(),
    solved: generateSolvedBoardWithOnes(),
    difficulty: "easy",
    status: "started",
    participants: []
  };
  
  export const generateSolvedBoard = (): SudokuBoardSolved => {
    const board: SudokuBoardSolved = Array.from({ length: 9 }, () => Array(9).fill(0));
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
    for (let i = 0; i < 9; i++) {
      const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
      for (let j = 0; j < 9; j++) {
        board[i][j] = shuffledNumbers[j];
      }
    }
    return board;
  };
  export const generateEmptyDraft = (): SudokuDraft => {
    return Array(9).fill(null).map(() => Array(9).fill([]));
  };
  export const generateEmptyDraftCell = (): DraftCell => {
    return Array(9).fill(0);
  };
  
  function getKeyByValue(obj: Record<string, string>, value: string): string | undefined {
    return Object.entries(obj).find(([key, val]) => val === value)?.[0];
  }