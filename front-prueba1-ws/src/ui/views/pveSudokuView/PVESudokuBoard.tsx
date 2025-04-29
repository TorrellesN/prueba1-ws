import React, { useEffect, useRef, useState } from 'react';
import { PlayerCell, PlayerSudokuBoard } from '../../../domain';




interface SudokuBoardProps {
  currentSudoku: PlayerSudokuBoard;
  onCellClick: (row: number, col: number, free: boolean) => void
}

export default function PVESudokuBoard({ currentSudoku, onCellClick }: SudokuBoardProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  

  const handleCellClick = (row: number, col: number, cell: PlayerCell) => {
    // Si la celda tiene rol 0, no se puede seleccionar pero sí destacar el número
    if (cell) {
      setSelectedNumber(cell.value);
      onCellClick(row, col, false);
    } else {
      setSelectedNumber(null);
      onCellClick(row, col, true)

    }
    setSelectedCell({ row, col });
  };


  const isCellSelectable = (cell: PlayerCell): boolean => {
    return cell === null || (cell && cell.rol !== 0);
  };


  const isInSameRowOrCol = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    return selectedCell.row === row || selectedCell.col === col;
  };


  const hasSameNumber = (cell: PlayerCell): boolean => {
    if (!selectedNumber || !cell) return false;
    return cell.value === selectedNumber;
  };

  // Define clases para los bordes
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


  const getCellClasses = (row: number, col: number, cell: PlayerCell): string => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const inSameRowOrCol = isInSameRowOrCol(row, col);
    const sameNumber = hasSameNumber(cell);
    /* const selectable = isCellSelectable(cell); */
    
    let classes = 'flex items-center justify-center h-full w-full transition-colors cursor-pointer ';
    
    
    classes += getCellBorderClasses(row, col);
    
    if (isSelected) {
      // seleccionada
      classes += 'bg-blue-300 font-bold';
    } else if (sameNumber) {
      // con el mismo número
      classes += 'bg-blue-200 font-bold';
    } else if (inSameRowOrCol) {
      // en la misma fila/columna
      classes += 'bg-blue-100 font-bold';
    } else if (cell && cell.rol === 0) {
      // del rol 0
      classes += 'bg-gray-200 font-bold ';
    }
    
    
    /* if (selectable) {
      classes += 'hover:bg-blue-100 cursor-pointer ';
    } */
    
    return classes;
  };

  //Lógica para quitar estilos al clicar fuera
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (boardRef.current && !boardRef.current.contains(event.target as Node)) {
        setSelectedCell(null);
        setSelectedNumber(null);
      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [boardRef]);


  if (!currentSudoku) {
    return <div className="text-center p-4">Cargando tablero de Sudoku...</div>;
  }

  return (
    <div ref={boardRef} className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="grid grid-cols-9 w-full aspect-square border-2 border-gray-800">
        {currentSudoku.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={getCellClasses(rowIndex, colIndex, cell)}
                onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                data-row={rowIndex}
                data-col={colIndex}
              >
                {cell ? cell.value : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
