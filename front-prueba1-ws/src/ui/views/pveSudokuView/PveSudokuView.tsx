import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../application/context/socketContext'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../../application/store/useAppStore';
import PveSudokuBoard from './PveSudokuBoard';
import SudokuInput from './SudokuInput';
import { toast } from 'react-toastify';
import { SocketCResponse } from '../../../domain';
import QuitGameModal from '../../components/sharedComponents/quitGameModal/QuitGameModal';
import { useQuitGameModal } from '../../components/sharedComponents/quitGameModal/useQuitGameModal';

export default function PVESudokuView() {

  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const comboAcc = useAppStore((state) => state.comboAcc);
  const isCorrectNumber = useAppStore((state) => state.isCorrectNumber);
  const calculatePoints = useAppStore((state) => state.calculatePoints);
  const savePVEMove = useAppStore((state) => state.savePVEMove);
  const resetCombo = useAppStore((state) => state.resetCombo);
  const setStartedSudokuState = useAppStore((state) => state.setStartedSudokuState);
  const fillEmptyCells = useAppStore((state) => state.fillEmptyCells);
  const restartSudokuState = useAppStore((state) => state.restartSudokuState);
  const setFinishedState = useAppStore((state) => state.setFinishedState);

  const navigate = useNavigate();
  const { socket, online } = useContext(SocketContext);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const finishnow = searchParams.get('finishnow');
  const {open, close, isOpenModal} = useQuitGameModal();

  const handleFinishNow = () => {
    if (finishnow && finishnow === 'true') {
      socket.emit('finish-now', (response: SocketCResponse) => {
        console.log('response', response);
        if (response.success) {
          fillEmptyCells();
          /* dfgdfgdfgfg */
        } else {
          console.error('No se ha podido completar');
        }
      });
    };
  }


  useEffect(() => {
    setIsLoading(true);
    // Intentar recuperar los datos de la partida desde localStorage o la BD
    const sudokuId = localStorage.getItem('sudokuRoomPve');
    if (sudokuId && online) {
      // Recuperar datos de la partida
      socket.emit('reconnect-to-pve-game', sudokuId, (response: SocketCResponse) => {
        if (response.success) {
          setStartedSudokuState(response.payload);
          handleFinishNow();
          setIsLoading(false);
          
        } else {
          console.error('Error al reconectar', response.payload);
          navigate('/pve/create');
        }
      });
    } else if (!sudokuId) {
      // Si no hay roomId en ls, redirigir a la página de creación de Sudoku
      navigate('/pve/create');
    }

  }, [online]);





  const handleCellClick = (row: number, col: number, free: boolean) => {
    if (free) {
      console.log
      setSelectedCell({ row, col });
    } else {
      setSelectedCell(null);
    }

  };


  const handleInputNumber = (number: number) => {
    console.log(`Número ingresado: ${number} `, selectedCell);
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (isCorrectNumber(number, row, col)) {

        const pointsForSaving = calculatePoints();
        socket.emit('save-pve-move', { row, col, value: number }, pointsForSaving, (response: SocketCResponse) => {
          if (response.success) {
            console.log('Movimiento guardado');
            savePVEMove({ row, col, value: number }, pointsForSaving);
          } else {
            console.error(response.payload);
            toast.error(response.payload);
          }
          if (response.success && response.payload === 'finished') toast.success('¡Ganaste!')
        });

      } else {
        toast.error('Número incorrecto');
        socket.emit('reset-pve-combo', (response: SocketCResponse) => {
          if (response.success) {
            resetCombo();
          }
        });
      }

    }

  }


  useEffect(() => {
    socket.on('sudoku-finished', (data)=>{
      setFinishedState();
      navigate('/pve/win')
    })
    return (() => {
      socket.off('sudoku-finished')
    })
  }, []);


  const handleQuit = () => {
    socket.emit('quit-pve-game')
    restartSudokuState();
    navigate('/')
  }


  //TODO: tal vez en el futuro deba borrarse esto debido a que ws es inestable y se puede desconectar.
  //actualmente se ejecutan estos cambios en un useEffect para evitar errores de render
  if (!online && !isLoading) {
    toast.error('Hubo un error de conexión, inténtalo de nuevo en unos minutos.');
    return (<Navigate to="/pve/create" replace />);
  }
  if (isLoading) {
    return <div>Cargando partida...</div>;
  }
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
          <PveSudokuBoard onCellClick={handleCellClick} />
        </div>

        {/* Contenedor de la izquierda (abajo en móvil) */}
        <div className=" w-full bg-gray-100 p-4 rounded-xl sm:col-span-2">
          <SudokuInput handleInputNumber={handleInputNumber} points={points} comboAcc={comboAcc} selectedCell={selectedCell} />
        </div>
      </div>
      <div>
        <button onClick={open}>
          Abandonar
        </button>
        <QuitGameModal isOpenModal={isOpenModal} close={close} handleQuit={handleQuit} />
        
      </div>
    </div>
  )
}



