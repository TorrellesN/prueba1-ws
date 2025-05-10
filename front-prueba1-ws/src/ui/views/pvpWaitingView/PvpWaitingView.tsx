import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../../application/context/socketContext";
import { diffOptions, Player, RolNumber, SocketCResponse } from "../../../domain";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../application/store/useAppStore";
import { useQuitGameModal } from "../../components/sharedComponents/quitGameModal/useQuitGameModal";
import QuitGameModal from "../../components/sharedComponents/quitGameModal/QuitGameModal";
import { getRolTextBgStyle } from "../../styles/sudokuCardStyles";



export default function PvpWaitingView() {

  const { socket, online } = useContext(SocketContext);
  const navigate = useNavigate();
  const players = useAppStore(state => state.players);
  const user = useAppStore(state => state.user);
  const rol = useAppStore(state => state.rol);
  const difficulty = useAppStore(state => state.difficulty);
  const id = useAppStore(state => state.id);
  const addPLayer = useAppStore(state => state.addPLayer);
  const removePlayer = useAppStore(state => state.removePlayer);
  const restartSudokuState = useAppStore(state => state.restartSudokuState);
  const setReadyOrWaitingPlayer = useAppStore(state => state.setReadyOrWaitingPlayer);
  const areAllPlayersReady = useAppStore(state => state.areAllPlayersReady);
  const { open, close, isOpenModal } = useQuitGameModal();
  
  const [ready, setReady] = useState(false);



  const handleQuit = () => {
    socket.emit('quit-pvp-waiting', id, (response: SocketCResponse) =>{
      console.log('response', response)
      restartSudokuState();
      navigate('/')
    })
  }

  const handleSetReady = () => {
    if (ready) {
      socket.emit('set-waiting', id, user.username); 
      setReady(false);
    }
    if (!ready) {
      const areAllReady = areAllPlayersReady();

      socket.emit('set-ready', user.username, areAllReady); 
      setReady(true);
    }
  }

  useEffect(() => {
    socket.on('player-joined', (player: Player) => {
      setReady(false);
      addPLayer(player);
    })

    socket.on('player-disconnected', ({username}) => {
      toast.error(`${username} se ha desconectado`);
      setReady(false);
      removePlayer(username);
    })

    socket.on('player-ready', ({username}) => {
      console.log('player-ready', username)
      setReadyOrWaitingPlayer(username);
    })

    socket.on('player-waiting', ({username}) => {
      console.log('player-w', username)
      setReadyOrWaitingPlayer(username);
    })

    socket.on('all-players-ready', (data) => {
      console.log('all-players-ready', data)
      navigate('/pvp/sudoku');
    })

    return () => {
      socket.off('player-joined');
      socket.off('player-disconnected');
      socket.off('player-ready');
      socket.off('player-waiting');
      socket.off('all-players-ready');
    }
  }, [socket]);

  useEffect(() => {
    if (!online) {
      socket.off('player-joined');
      toast.error('Parece que tu conexión es inestable, vuelve a intentarlo más tarde');
      navigate('/pvp/create');
    }
  }, [online]);



  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Title div */}
        <div className="text-center">
          <h3 className="text-3xl font-bold">Sudoku PVP</h3>
          <h3 className="text-xl font-bold">Dificultad {diffOptions[difficulty]}</h3>
          <h3 className="text-lg font-bold">'animacion'Esperando Oponentes...</h3>
          <p className="text-gray-600 mt-2">Espera a que otros jugadores se unan a la partida</p>
        </div>

        {/* Grid 2x2 div */}
        <div className="grid grid-cols-2 gap-4 w-full">

          <div 
            className="p-6 rounded-lg shadow-md flex items-center justify-center"
            style={getRolTextBgStyle(rol || 1)}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="px-4 py-1 bg-red-400">.</div>
              <h4 className="text-md font-semibold">
                {user.username}
              </h4>
              <p>{ready ? 'Listo!' : 'Esperando...' }</p>
            </div>
          </div>

          {players && players.map((player, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg shadow-md flex items-center justify-center"
            style={getRolTextBgStyle(player.rol) }
            >
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-1 bg-red-400">.</div>
                <h4 className="text-md font-semibold">
                  {player.username}
                </h4>
                <p>{player.ready ? 'Listo!' : 'Esperando...' }</p>
              </div>
            </div>
          ))}

        </div>

        {/* Button div */}
        <div className="mt-4">
          <button onClick={open}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Abandonar
          </button>
          <QuitGameModal isOpenModal={isOpenModal} close={close} handleQuit={handleQuit} />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            onClick={handleSetReady}
          >
            {ready ?  'Esperar a jugadores' : 'Listo para jugar'}
          </button>
        </div>
      </div>
    </div>
  );
}
