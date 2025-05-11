import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../application/context/socketContext';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../../application/store/useAppStore';
import { toast } from 'react-toastify';
import { diffOptions, Player, RolNumber, SocketCResponse, UserLoginDataWRememberSchema } from '../../../domain';
import QuitGameModal from '../../components/sharedComponents/quitGameModal/QuitGameModal';
import { useQuitGameModal } from '../../components/sharedComponents/quitGameModal/useQuitGameModal';
import Countdown from './components/Countdown';
import { getRolTextBgStyle } from '../../styles/sudokuCardStyles';
import PvpSudokuBoard from './components/PvpSudokuBoard';
import SudokuInput from '../../components/sudokuCommonComponents/SudokuInput';

export default function PvpSudokuView() {

  const token = useAppStore((state) => state.token);
  const rol = useAppStore((state) => state.rol);
  const points = useAppStore((state) => state.points);
  const comboAcc = useAppStore((state) => state.comboAcc);
  const isCorrectNumber = useAppStore((state) => state.isCorrectNumber);
  const calculatePoints = useAppStore((state) => state.calculatePoints);
  const savePVPSelfMove = useAppStore((state) => state.savePVPSelfMove);
  const savePVPPlayerMove = useAppStore((state) => state.savePVPPlayerMove);
  const resetCombo = useAppStore((state) => state.resetCombo);
  const setStartedSudokuState = useAppStore((state) => state.setStartedSudokuState);
  const fillEmptyCells = useAppStore((state) => state.fillEmptyCells);
  const restartSudokuState = useAppStore((state) => state.restartSudokuState);
  const setFinishedState = useAppStore((state) => state.setFinishedState);
  const players = useAppStore((state) => state.players);
  const difficulty = useAppStore(state => state.difficulty);
  const resetOtherPlayersCombo = useAppStore(state => state.resetOtherPlayersCombo);
  const removePlayer = useAppStore(state => state.removePlayer);


  const navigate = useNavigate();
  const { socket, online } = useContext(SocketContext);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const finishnow = searchParams.get('finishnow');
  const { open, close, isOpenModal } = useQuitGameModal();
  const id = useAppStore(state => state.id);

  /*   const handleFinishNow = () => {
      if (finishnow && finishnow === 'true') {
        socket.emit('finish-now', (response: SocketCResponse) => {
          console.log('response', response);
          if (response.success) {
            fillEmptyCells();
          } else {
            console.error('No se ha podido completar');
          }
        });
      };
    } */


  /*   useEffect(() => {
      setIsLoading(true);
      // Intentar recuperar los datos de la partida desde localStorage o la BD
      const sudokuId = localStorage.getItem('sudokuRoomPvp');
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
  
    }, [online]); */





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
        socket.emit('save-pvp-move', { row, col, value: number, rol: rol }, pointsForSaving, difficulty, (response: SocketCResponse) => {
          if (response.success) {
            console.log('Movimiento guardado');
            savePVPSelfMove({ row, col, value: number }, pointsForSaving);
          } else {
            console.error(response.payload);
            toast.error(response.payload);
          }
          if (response.success && response.payload === 'finished') toast.success('¡Ganaste!')
        });

      } else {
        toast.error('Número incorrecto');
        if (comboAcc > 0) {
          socket.emit('reset-pvp-combo', difficulty, ( response: SocketCResponse) => {
            if (response.success) {
              resetCombo();
            }
          });
        }
      }

    }

  }


  useEffect(() => {
    /*     socket.on('sudoku-finished', (data)=>{
          setFinishedState();
          navigate('/pve/win')
        }) */

    socket.on('player-pvp-move', (data: { cellToInsert: { row: number, col: number, value: number, rol: RolNumber }, player: Player }) => {
      console.log('player-pvp-move', data);
      const { cellToInsert, player } = data;
      if (rol !== player.rol) {
        savePVPPlayerMove(cellToInsert, player);
      }
    })

    socket.on('player-reset-combo', ({ email}) => {
      resetOtherPlayersCombo(email);
    });

    socket.on('player-pvp-quit', ({username}) => {
      toast.info(`${username} ha abandonado la partida`);
            removePlayer(username);
    })

    return (() => {
      socket.off('sudoku-finished');
      socket.off('player-pvp-move');
      socket.off('player-reset-combo');
    })
  }, []);


    const handleQuit = () => {
      socket.emit('quit-pvp-game', difficulty)
      restartSudokuState();
      navigate('/')
    }


  //TODO: tal vez en el futuro deba borrarse esto debido a que ws es inestable y se puede desconectar.
  //actualmente se ejecutan estos cambios en un useEffect para evitar errores de render
  if (!online && !isLoading) {
    toast.error('Hubo un error de conexión, inténtalo de nuevo en unos minutos.');
    toast.error('REVISA SESTO');
    return (<Navigate to="/pvp/create" replace />);
  }
  if (isLoading && id) {
    return <Countdown sudokuId={id} setIsLoading={setIsLoading} />;
  }
  if (!token) return (<p className="text-2xl font-light text-gray-500 mt-5">
    Necesitas autenticarte para poder jugar. <Link to={'/auth/login'}>Iniciar sesión</Link>
  </p>)


  return (
    <div>
      <h1 className="text-5xl font-black">Sudoku multijugador</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Nivel <span className="font-bold">{diffOptions[difficulty]}</span>
      </p>

      <div className="flex flex-col items-center gap-4 mt-8 sm:grid sm:grid-cols-7 sm:items-start sm:justify-center">
        <div className="grid grid-cols-2 gap-4 w-full">

          {/* Contenedor de la derecha (arriba en móvil) */}
          <div className="w-full bg-gray-100 p-4 rounded-xl sm:col-span-2">
            {players && players.map((player, index) => (
              <div key={index} className='p-6 rounded-lg shadow-md flex items-center justify-center'
                style={{ ...getRolTextBgStyle(player.rol) }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="px-4 py-1 bg-red-400">.</div>
                  <h4 className="text-md font-semibold" >{player.username}</h4>
                  <p>{player.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sudoku en el centro */}
        <div className="w-full sm:col-span-3">
          <PvpSudokuBoard onCellClick={handleCellClick} />
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



