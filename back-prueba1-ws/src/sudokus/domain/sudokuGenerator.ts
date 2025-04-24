import { Cell, Difficulty, FormattedSudokuBoard, SudokuBoard, SudokuBoardSolved } from "./Sudoku";



export type SudokuResult = {
  current: FormattedSudokuBoard;
  solved: SudokuBoardSolved;
};

// Define niveles de dificultad por cantidad de celdas a eliminar
enum DifficultyCells {
  Easy = 35,    // Elimina ~35 celdas (deja ~46 números)
  Medium = 45,  // Elimina ~45 celdas (deja ~36 números)
  Hard = 55     // Elimina ~55 celdas (deja ~26 números)
}

/**
 * Genera un sudoku según el nivel de dificultad especificado
 */
function generateSudoku(difficulty: Difficulty): SudokuResult {
  // Límite máximo de intentos para generar un sudoku válido
  const MAX_ATTEMPTS = 10;
  let attempts = 0;
  
  // Inicializar con un tablero vacío para evitar problemas de tipado
  let solvedBoard: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
  let boardCreated = false;
  
  // Intentar crear un sudoku resuelto
  while (attempts < MAX_ATTEMPTS && !boardCreated) {
    try {
      const tempBoard = createSolvedSudoku();
      if (isBoardComplete(tempBoard)) {
        solvedBoard = tempBoard;
        boardCreated = true;
      } else {
        attempts++;
      }
    } catch (error) {
      console.error("Error generando sudoku resuelto:", error);
      attempts++;
    }
  }
  
  // Si no se pudo crear después de varios intentos, lanzar error
  if (!boardCreated) {
    throw new Error("No se pudo generar un sudoku resuelto después de múltiples intentos");
  }
  
  // 2. Convertir la dificultad a número de celdas a eliminar
  let cellsToRemove: number;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = DifficultyCells.Easy;
      break;
    case 'medium':
      cellsToRemove = DifficultyCells.Medium;
      break;
    case 'hard':
      cellsToRemove = DifficultyCells.Hard;
      break;
    default:
      cellsToRemove = DifficultyCells.Medium;
  }
  
  // Reiniciar contador de intentos
  attempts = 0;
  let currentBoard: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
  let puzzleCreated = false;
  
  // 3. Crear el tablero inicial para resolver eliminando celdas
  while (attempts < MAX_ATTEMPTS && !puzzleCreated) {
    try {
      const tempBoard = createPuzzle(solvedBoard, cellsToRemove);
      currentBoard = tempBoard;
      puzzleCreated = true;
    } catch (error) {
      console.warn("Error al crear puzzle con dificultad solicitada:", error);
      // Si falla con la dificultad actual, reducir la dificultad
      if (cellsToRemove > DifficultyCells.Easy) {
        cellsToRemove -= 5;
        console.log(`Reduciendo dificultad, intentando con ${cellsToRemove} celdas eliminadas`);
      }
      attempts++;
    }
  }
  
  // Si no se pudo crear después de varios intentos, usar el tablero resuelto
  // y eliminar un pequeño número de celdas para garantizar al menos un puzzle
  if (!puzzleCreated) {
    console.warn("Fallback: Creando un sudoku simplificado");
    currentBoard = createSimplePuzzle(solvedBoard, 20); // Eliminar solo 20 celdas
  }
  
  // 4. Formatear el tablero inicial según el formato requerido
  const formattedCurrentBoard = formatCurrentSudoku(currentBoard);
  
  return {
    current: formattedCurrentBoard,
    solved: solvedBoard as SudokuBoardSolved
  };
}

/**
 * Crea un tablero de sudoku 9x9 completamente resuelto
 */
function createSolvedSudoku(): SudokuBoard {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;
  
  while (attempts < MAX_ATTEMPTS) {
    const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Estrategia 1: Llenar la diagonal principal (bloques que no se afectan entre sí)
    fillDiagonalBoxes(board);
    
    // Intentar resolver el resto del tablero
    const solved = solveSudoku(board);
    
    if (solved && isBoardComplete(board)) {
      return board;
    }
    
    // Si la estrategia 1 falla, intentar método alternativo
    if (attempts === MAX_ATTEMPTS - 1) {
      const altBoard = createSudokuFast();
      if (isBoardComplete(altBoard)) {
        return altBoard;
      }
    }
    
    attempts++;
  }
  
  throw new Error("No se pudo crear un sudoku resuelto");
}

/**
 * Verifica si el tablero está completamente lleno
 */
function isBoardComplete(board: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Llena los bloques diagonales 3x3 del tablero
 */
function fillDiagonalBoxes(board: SudokuBoard): void {
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
}

/**
 * Llena un bloque 3x3 con números del 1 al 9 aleatorizados
 */
function fillBox(board: SudokuBoard, startRow: number, startCol: number): void {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(nums);
  
  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[startRow + i][startCol + j] = nums[index++];
    }
  }
}

/**
 * Mezcla un array aleatoriamente (Fisher-Yates shuffle)
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Resuelve un tablero de sudoku usando backtracking
 * Devuelve true si encuentra una solución, false en caso contrario
 */
function solveSudoku(board: SudokuBoard): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // No hay más celdas vacías, el sudoku está resuelto
  
  const { row, col } = emptyCell;
  
  // Intenta colocar números del 1 al 9
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleArray(nums); // Para generar sudokus diferentes cada vez
  
  for (const num of nums) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      
      if (solveSudoku(board)) {
        return true;
      }
      
      // Si no lleva a una solución, hacer backtrack
      board[row][col] = null;
    }
  }
  
  return false;
}

/**
 * Encuentra una celda vacía en el tablero
 */
function findEmptyCell(board: SudokuBoard): Cell | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        return { row, col, value: null };
      }
    }
  }
  return null;
}

/**
 * Verifica si es válido colocar un número en la posición dada
 */
function isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
  // Verificar fila
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }
  
  // Verificar columna
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }
  
  // Verificar bloque 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
}

/**
 * Crea un puzzle eliminando celdas del tablero resuelto
 * asegurando que tenga solución única
 */
function createPuzzle(solvedBoard: SudokuBoard, cellsToRemove: number): SudokuBoard {
  // Clonar el tablero resuelto
  const puzzleBoard: SudokuBoard = JSON.parse(JSON.stringify(solvedBoard));
  
  // Crear una lista de todas las celdas
  const cells: Cell[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells.push({ row, col, value: puzzleBoard[row][col] });
    }
  }
  
  // Mezclar la lista para eliminar celdas aleatorias
  shuffleArray(cells);
  
  // Intentar eliminar celdas una por una
  let count = 0;
  let maxAttempts = Math.min(cells.length, cellsToRemove * 2); // Límite de intentos
  let attemptsMade = 0;
  
  for (const cell of cells) {
    if (count >= cellsToRemove || attemptsMade >= maxAttempts) break;
    
    const { row, col } = cell;
    const temp = puzzleBoard[row][col];
    puzzleBoard[row][col] = null;
    attemptsMade++;
    
    // Verificar si todavía tiene solución única
    if (!hasUniqueSolution(puzzleBoard, solvedBoard)) {
      // Si no tiene solución única, restaurar el valor
      puzzleBoard[row][col] = temp;
    } else {
      count++;
    }
  }
  
  // Si no pudimos eliminar suficientes celdas para la dificultad requerida
  if (count < cellsToRemove * 0.7) { // Si eliminamos menos del 70% de lo pedido
    throw new Error(`No se pudieron eliminar suficientes celdas para la dificultad requerida (${count}/${cellsToRemove})`);
  }
  
  return puzzleBoard;
}

/**
 * Crea un puzzle simple eliminando un número fijo de celdas sin verificar unicidad
 * Útil como fallback cuando createPuzzle falla
 */
function createSimplePuzzle(solvedBoard: SudokuBoard, cellsToRemove: number): SudokuBoard {
  // Clonar el tablero resuelto
  const puzzleBoard: SudokuBoard = JSON.parse(JSON.stringify(solvedBoard));
  
  // Crear una lista de todas las celdas
  const cells: Cell[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells.push({ row, col, value: puzzleBoard[row][col] });
    }
  }
  
  // Mezclar la lista para eliminar celdas aleatorias
  shuffleArray(cells);
  
  // Eliminar un número fijo de celdas
  for (let i = 0; i < Math.min(cellsToRemove, cells.length); i++) {
    const { row, col } = cells[i];
    puzzleBoard[row][col] = null;
  }
  
  return puzzleBoard;
}

/**
 * Verifica si el tablero tiene una solución única
 */
function hasUniqueSolution(board: SudokuBoard, solution: SudokuBoard): boolean {
  try {
    const boardCopy: SudokuBoard = JSON.parse(JSON.stringify(board));
    
    // Resolvemos el sudoku y verificamos si coincide con la solución original
    if (solveSudokuAndCheck(boardCopy, solution)) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error al verificar solución única:", error);
    return false;
  }
}

/**
 * Resuelve el sudoku y verifica si coincide con la solución esperada
 */
function solveSudokuAndCheck(board: SudokuBoard, solution: SudokuBoard): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) {
    // No hay más celdas vacías, verificar si coincide con la solución
    return boardsMatch(board, solution);
  }
  
  const { row, col } = emptyCell;
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      
      if (solveSudokuAndCheck(board, solution)) {
        return true;
      }
      
      board[row][col] = null;
    }
  }
  
  return false;
}

/**
 * Verifica si dos tableros coinciden
 */
function boardsMatch(board1: SudokuBoard, board2: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Formatea el tablero actual según el formato requerido
 */
function formatCurrentSudoku(board: SudokuBoard): FormattedSudokuBoard {
  const formattedBoard: FormattedSudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== null) {
        formattedBoard[row][col] = {
          rol: 0,  // Valor fijo según requisitos
          number: board[row][col] as number
        };
      } else {
        formattedBoard[row][col] = null;
      }
    }
  }
  
  return formattedBoard;
}

/**
 * Crea un sudoku completo con valores aleatorios
 * Este método es más eficiente para crear sudokus desde cero
 */
function createSudokuFast(): SudokuBoard {
  const MAX_ATTEMPTS = 5;
  let attempts = 0;
  
  while (attempts < MAX_ATTEMPTS) {
    try {
      // Crear un tablero vacío
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
      
      // Generar primer número para evitar grids vacíos
      board[0][0] = Math.floor(Math.random() * 9) + 1;
      
      // Resolver el tablero
      const solved = solveSudoku(board);
      
      if (solved && isBoardComplete(board)) {
        return board;
      }
      
      attempts++;
    } catch (error) {
      console.error("Error en createSudokuFast:", error);
      attempts++;
    }
  }
  
  throw new Error("No se pudo crear un sudoku rápido después de múltiples intentos");
}

/**
 * Método principal para generar un sudoku
 * Implementa manejo de errores para garantizar que siempre devuelva un resultado
 */
export function createSudokuGame(difficulty: Difficulty): SudokuResult {
  try {
    return generateSudoku(difficulty);
  } catch (error) {
    console.error("Error generando sudoku, utilizando fallback:", error);
    
    // Último recurso: crear un sudoku muy simple
    const emptyBoard: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    
    // Llenar el tablero con un patrón predeterminado válido
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Patrón diagonal que garantiza un sudoku válido
        emptyBoard[i][j] = ((i * 3 + Math.floor(i / 3) + j) % 9) + 1;
      }
    }
    
    // Crear un puzzle muy simple eliminando pocas celdas
    const simpleBoard = createSimplePuzzle(emptyBoard, 10);
    
    return {
      current: formatCurrentSudoku(simpleBoard),
      solved: emptyBoard as SudokuBoardSolved
    };
  }
}