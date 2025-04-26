import React, { useState } from 'react';
import { PlayerCell, PlayerSudokuBoard } from '../../../domain';




interface SudokuBoardProps {
  currentSudoku: PlayerSudokuBoard;
  onCellClick: (row: number, col: number) => void;
}

export default function PVESudokuBoard({ currentSudoku, onCellClick }: SudokuBoardProps) {
  // Estado para la celda seleccionada actualmente
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Manejador de clic en celda
  const handleCellClick = (row: number, col: number, cell: PlayerCell) => {
    // Si la celda tiene rol 0, no se puede seleccionar
    if (cell && cell.rol === 0) return;
    
    setSelectedCell({ row, col });
    
    // Si hay un manejador de clic proporcionado, lo llamamos
    
      onCellClick(row, col);
    
  };

  // Función para determinar si una celda es seleccionable
  const isCellSelectable = (cell: PlayerCell): boolean => {
    return cell === null || (cell && cell.rol !== 0);
  };

  // Función para determinar si una celda debe tener borde grueso (bordes externos o bordes de los subcuadrados 3x3)
  const getCellBorderClasses = (row: number, col: number): string => {
    let borderClasses = '';
    
    // Borde superior
    if (row === 0) {
      borderClasses += 'border-t-2 ';
    } else if (row % 3 === 0) {
      borderClasses += 'border-t-2 ';
    } else {
      borderClasses += 'border-t ';
    }
    
    // Borde inferior
    if (row === 8) {
      borderClasses += 'border-b-2 ';
    } else {
      borderClasses += 'border-b ';
    }
    
    // Borde izquierdo
    if (col === 0) {
      borderClasses += 'border-l-2 ';
    } else if (col % 3 === 0) {
      borderClasses += 'border-l-2 ';
    } else {
      borderClasses += 'border-l ';
    }
    
    // Borde derecho
    if (col === 8) {
      borderClasses += 'border-r-2 ';
    } else {
      borderClasses += 'border-r ';
    }
    
    return borderClasses;
  };

  // Función para determinar las clases de estilo de una celda basadas en su estado
  const getCellClasses = (row: number, col: number, cell: PlayerCell): string => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const selectable = isCellSelectable(cell);
    
    let classes = 'flex items-center justify-center h-full w-full ';
    
    // Añadir clases de borde
    classes += getCellBorderClasses(row, col);
    
    // Añadir clases basadas en el contenido y estado de la celda
    if (cell && cell.rol === 0) {
      // Celdas prefijadas (fondo azul claro, no seleccionables)
      classes += 'bg-blue-50 text-black font-bold ';
    } else if (isSelected) {
      // Celda seleccionada
      classes += 'bg-blue-200 ';
    } else if (selectable) {
      // Celdas seleccionables con efecto hover
      classes += 'hover:bg-blue-100 cursor-pointer ';
    }
    
    return classes;
  };

  if(currentSudoku.length === 0) return <p className="text-2xl font-light text-gray-500 mt-5">Cargando sudoku...</p>
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="grid grid-cols-9 w-full aspect-square border-2 border-gray-800">
        {currentSudoku.map((row, rowIndex) => (
          // Usamos un React.Fragment en lugar de una fila div para mantener la estructura del grid
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={getCellClasses(rowIndex, colIndex, cell)}
                onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {cell ? cell.number : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
