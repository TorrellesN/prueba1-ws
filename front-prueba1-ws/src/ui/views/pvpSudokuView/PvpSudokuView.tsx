import { useContext, useEffect, useRef, useState } from 'react';
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
  const user = useAppStore((state) => state.user);
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


  const [reconnected, setReconnected] = useState(false);
  const eventsRegistered = useRef(false);

  //Lógica de ls, rescatar estado del sudoku, comprobar online, etc.
  useEffect(() => {

    //!BORRAR CUANDO VUELVA A IMPLEMENTAR COUNTDOWN
    // localStorage.setItem('sudokuRoomPvp', JSON.stringify({sudokuId: id, difficulty: difficulty!}));

    //Solo para notificar desconexiones durante la partida
    if (!online && reconnected) {
      toast.warning('Es posible que la partida no se haya actualizado, recarga la página.');
      return;
    }
    if (reconnected) return;
    if (!online) return;

    const sudokuLSObj = localStorage.getItem('sudokuRoomPvp');

    //Para verificar si se intentó conectar anteriormente
    const reconnectAttempted = localStorage.getItem('reconnectAttempted');

    if (!sudokuLSObj) {
      navigate('/pvp/create');
      return;
    }

    if (rol > 0 || reconnectAttempted === 'true') {
      // Si ya tenemos rol o si venimos de una reconexión previa
      setReconnected(true);
      localStorage.removeItem('reconnectAttempted'); 
      return;
    }

    localStorage.setItem('reconnectAttempted', 'true');

    socket.emit('reconnect-to-pvp-game', JSON.parse(sudokuLSObj), (response: SocketCResponse) => {
      if (response.success && 'current' in response.payload) {
        const players = [...response.payload.players];
        const playerIndex = players.findIndex((player: Player) => player.email === user?.email);

        if (playerIndex === -1) {
          toast.warning('No perteneces a este sudoku');
          localStorage.removeItem('sudokuRoomPvp');
          navigate('/pvp/create');
          return;
        }

        setStartedSudokuState(response.payload);
        setReconnected(true);
      } else if (response.success && response.payload === 'finished') {
        toast.warning('Parece que el sudoku al que estás intentando reconectar ya ha terminado');
        localStorage.removeItem('sudokuRoomPvp');
        navigate('/pve/create');
      } else {
        console.error('Error al reconectar', response.payload);
        navigate('/pvp/create');
      }
    });
  }, [online]);


  //Handler de los eventos
  useEffect(() => {
    if (eventsRegistered.current) return;

    function handlePlayerMove(data: { cellToInsert: { row: number, col: number, value: number, rol: RolNumber }, player: Player }) {
      console.log('player-pvp-move', data);
      const { cellToInsert, player } = data;
      if (rol !== player.rol) {
        savePVPPlayerMove(cellToInsert, player);
      }
    }

    function handleResetCombo({ email }: { email: string }) {
      resetOtherPlayersCombo(email);
    }

    function handlePlayerQuit({ username }: { username: string }) {
      toast.info(`${username} ha abandonado la partida`);
      removePlayer(username);
    }

    socket.on('player-pvp-move', handlePlayerMove);
    socket.on('player-reset-combo', handleResetCombo);
    socket.on('player-pvp-quit', handlePlayerQuit);
    socket.on('sudoku-finished', () => {
      setFinishedState();
      navigate('/pvp/win');
    });

    eventsRegistered.current = true;

    return () => {
      socket.off('player-pvp-move', handlePlayerMove);
      socket.off('player-reset-combo', handleResetCombo);
      socket.off('player-pvp-quit', handlePlayerQuit);
      socket.off('sudoku-finished');
      eventsRegistered.current = false;
    };
  }, []);

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
          if (response.success && response.payload === 'finished') toast.success('¡Ganaste!');
        });
      } else {
        toast.error('Número incorrecto');
        if (comboAcc > 0) {
          socket.emit('reset-pvp-combo', difficulty, (response: SocketCResponse) => {
            if (response.success) {
              resetCombo();
            }
          });
        }
      }
    }
  };

  const handleQuit = () => {
    /* socket.emit('quit-pvp-game', difficulty); */
    restartSudokuState();
  };

    if (isLoading && id) {
      console.log('Cargando partida...');
      return <Countdown sudokuId={id} setIsLoading={setIsLoading} difficulty={difficulty} />;
    }
  if (!token) return (<p className="text-2xl font-light text-gray-500 mt-5">
    Necesitas autenticarte para poder jugar. <Link to={'/auth/login'}>Iniciar sesión</Link>
  </p>);

  return (
    <div>
      <h1 className="text-5xl font-black">Sudoku multijugador</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Nivel <span className="font-bold">{diffOptions[difficulty]}</span>
      </p>

      <div className="flex flex-col items-center gap-4 mt-8 sm:grid sm:grid-cols-7 sm:items-start sm:justify-center">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="w-full bg-gray-100 p-4 rounded-xl sm:col-span-2">
            {players && players.map((player, index) => (
              <div key={index} className='p-6 rounded-lg shadow-md flex items-center justify-center'
                style={{ ...getRolTextBgStyle(player.rol) }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="px-4 py-1 bg-red-400">.</div>
                  <h4 className="text-md font-semibold">{player.username}</h4>
                  <p>{player.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full sm:col-span-3">
          <PvpSudokuBoard onCellClick={handleCellClick} />
        </div>

        <div className="w-full bg-gray-100 p-4 rounded-xl sm:col-span-2">
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
  );
}



