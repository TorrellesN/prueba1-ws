import  { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../application/context/socketContext'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../application/store/useAppStore';
import PVESudokuBoard from './PVESudokuBoard';
import SudokuInput from './SudokuInput';
import { toast } from 'react-toastify';
import { socketCResponse } from '../../../domain/';

export default function PVESudokuView() {

  const navigate = useNavigate();
  const { socket, online, disconnectSocket } = useContext(SocketContext);
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const comboAcc = useAppStore((state) => state.comboAcc);
  const current = useAppStore((state) => state.current);
  const setStartedStatus = useAppStore((state) => state.setStartedStatus);
  const isCorrectNumber = useAppStore((state) => state.isCorrectNumber);
  const calculatePoints = useAppStore((state) => state.calculatePoints);
  const savePVEMove = useAppStore((state) => state.savePVEMove);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);


  const handleCellClick = (row: number, col: number, free: boolean) => {
    if (free) {
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }
    
  };


  const handleInputNumber = (number: number) => {
    console.log(`Número ingresado: ${number} `, selectedCell);
    if (selectedCell) {
      const { row, col } = selectedCell;
      if(isCorrectNumber(number, row, col)) {
        const pointsForSaving = calculatePoints();
        socket.emit('save-pve-move', { row, col, value: number }, pointsForSaving, (response: socketCResponse) => {
          if (response.success) {
            console.log('Movimiento guardado');
            savePVEMove({ row, col, value: number }, pointsForSaving);
          } else {
            console.error(response.payload);
            toast.error(response.payload);
          }
        });
      }
      
    }

  }
   


  useEffect(() => {
    if(online) {
    setStartedStatus();
    }
    
  }, []);
/*   useEffect(() => {
    
    return () => {
      if(socket && online) {
        console.log('Desconectando socket al salir de la vista del Sudoku');
        disconnectSocket();
      };
    }
  }, []); */



  if (!online) {
    toast.error('Hubo un error de conexión, inténtalo de nuevo en unos minutos.');
    return(<Navigate to="/pve/create" replace />);}
  if (!token) return (<p className="text-2xl font-light text-gray-500 mt-5">
    Necesitas autenticarte para poder jugar. <Link to={'/auth/login'}>Iniciar sesión</Link>
  </p>)

  return (
    <div>
      <h1 className="text-5xl font-black">Sudoku un jugador</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Sudoku de {user.username}
      </p>

      <div className="flex flex-col items-center gap-4 mt-8 sm:grid sm:grid-cols-7 sm:items-start sm:justify-center">
        {/* Contenedor de la derecha (arriba en móvil) */}
        <div className="w-full bg-gray-100 p-4 rounded-xl sm:col-span-2">
          {/* Aquí va el componente de la derecha */}
        </div>

        {/* Sudoku en el centro */}
        <div className="w-full sm:col-span-3">
          <PVESudokuBoard currentSudoku={current} onCellClick={handleCellClick} />
        </div>

        {/* Contenedor de la izquierda (abajo en móvil) */}
        <div className=" w-full bg-gray-100 p-4 rounded-xl sm:col-span-2">
          <SudokuInput handleInputNumber={handleInputNumber} points={points} comboAcc={comboAcc} />
        </div>
      </div>
    </div>
  )
}



