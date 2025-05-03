import { FormattedSudokuBoard, SudokuBoardSolved } from "./Sudoku";


export function fillEmptyCells(
): FormattedSudokuBoard {
  // Valor de rol predeterminado si no se especifica
  const rol = 1;
  const fillAll = false;
  
  // Crear una copia profunda del tablero actual para no modificar el original
  const filledBoard: FormattedSudokuBoard = JSON.parse(JSON.stringify(current));
  
  // Recorrer cada celda del tablero
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Si la celda está vacía o si fillAll es true
      if (filledBoard[row][col] === null || (fillAll && filledBoard[row][col])) {
        // Obtener el valor del tablero resuelto
        const value = solved[row][col];
        
        // Si estamos reemplazando una celda existente y fillAll es true
        if (filledBoard[row][col] !== null && fillAll) {
          filledBoard[row][col] = {
            rol: rol,
            value: value
          };
        } 
        // Si la celda está vacía
        else if (filledBoard[row][col] === null) {
          filledBoard[row][col] = {
            rol: rol,
            value: value
          };
        }
      }
    }
  }
  
  return filledBoard;
}

/**
 * Cuenta el número de celdas vacías en un tablero formateado
 * 
 * @param board El tablero formateado
 * @returns El número de celdas vacías (null)
 */
export function countEmptyCells(board: FormattedSudokuBoard): number {
  let count = 0;
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        count++;
      }
    }
  }
  
  return count;
}



/**
 * Verifica si un tablero está completamente resuelto y es válido
 * 
 * @param board El tablero formateado
 * @returns true si el tablero está completo y todas las celdas son válidas
 */
export function isBoardComplete(board: FormattedSudokuBoard): boolean {
  // Verificar que no haya celdas vacías
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        return false;
      }
      
      // Verificar validez de cada celda
      const value = board[row][col]!.value;
      
      // Temporalmente eliminar esta celda para validarla
      const originalCell = board[row][col];
      board[row][col] = null;
      
      const isValid = isValidMove(board, row, col, value);
      
      // Restaurar la celda
      board[row][col] = originalCell;
      
      if (!isValid) {
        return false;
      }
    }
  }
  
  return true;
}

