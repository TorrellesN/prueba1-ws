import { useContext, useMemo, useState } from "react"
import { SocketContext } from "../../../application/context/socketContext"
import { Listbox } from "@headlessui/react"
import { useNavigate } from "react-router-dom"
import { Difficulty, diffOptions, Player, SocketCResponse } from "../../../domain";
import { useAppStore } from "../../../application/store/useAppStore";
import { toast } from "react-toastify";

export default function PvpCreateSudokuView() {

  const navigate = useNavigate();
  const [difSelected, setDifSelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const difficulty = useMemo<Difficulty>(() => (Object.entries(diffOptions).find(([, val]) => val === difSelected)?.[0]) as Difficulty, [difSelected])
  const setInnitialSudokuState = useAppStore(state => state.setInnitialSudokuState);
  const setSelfPlayer = useAppStore(state => state.setSelfPlayer);
  const setStartedSudokuState = useAppStore(state => state.setStartedSudokuState);
  const setFinishedState = useAppStore(state => state.setFinishedState);
  const user = useAppStore(state => state.user);
  const { socket, online } = useContext(SocketContext);
  const [lastGameObj, setLastGameObj] = useState<string | null>(
    localStorage.getItem('sudokuRoomPvp')
      ? JSON.parse(localStorage.getItem('sudokuRoomPvp')!) : null
  )


  const handleSudokuCreate = () => {
    if (difficulty) {
      setIsLoading(true);

      socket.emit('request-sudoku-pvp', difficulty, (response: SocketCResponse) => {
        if (response.success) {
          console.log(response.payload)
          setInnitialSudokuState(response.payload.sudoku);
          setSelfPlayer(response.payload.player);
          setIsLoading(false);
          navigate(`/pvp/waiting`)
        } else {
          console.error('Error al crear el sudoku')
          toast.error(response.payload);
          setIsLoading(false);
        }
      });
    }
  }

  const handleLastGame = () => {
    setIsLoading(true);
    if (lastGameObj && online) {
      // En lugar de navegar directamente, utilizamos el socket para verificar primero
      socket.emit('reconnect-to-pvp-game', lastGameObj, (response: SocketCResponse) => {
        if (response.success && 'current' in response.payload) {
          const players = [...response.payload.players];
          const playerIndex = players.findIndex((player: Player) => player.email === user?.email);
          
          // Si el jugador no existe en la sala
          if (playerIndex === -1) {
            toast.warning('No perteneces a este sudoku');
            localStorage.removeItem('sudokuRoomPvp');
            setLastGameObj(null);
            setIsLoading(false);
            return;
          }
          
          // Establecemos el estado y navegamos
          setStartedSudokuState(response.payload);
          setIsLoading(false);
          
          // Añadimos un flag al localStorage para indicar que ya estamos reconectados
          localStorage.setItem('reconnectAttempted', 'true');
          
          navigate('/pvp/sudoku');
        } else if (response.success && response.payload === 'finished') {
          toast.warning('Parece que el sudoku al que estás intentando reconectar ya ha terminado');
          localStorage.removeItem('sudokuRoomPvp');
          setLastGameObj(null);
          setIsLoading(false);
        } else {
          console.error('Error al reconectar', response.payload);
          setIsLoading(false);
        }
      });
    } else if (!lastGameObj) {
      toast.error('No hay ninguna partida en curso');
      setIsLoading(false);
    }
  }


  if (isLoading) {
    return <div>Cargando partida...</div>;
  }

  return (
    <>
      <h1 className="text-5xl font-black">Prueba</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Define la dificultad para tu sudoku:
      </p>



      <div className="my-5">

        <Listbox value={difSelected} onChange={(value) => setDifSelected(value)}>
          {({ open }) => (
            <div className="relative mt-3">
              <Listbox.Button className="block w-full appearance-none rounded-lg border-none bg-black/50 py-1.5 px-3 text-sm/6 text-white focus:outline-none">
                {difSelected || 'Selecciona una opción'}
              </Listbox.Button>
              {open && (
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                  {Object.entries(diffOptions).map(([key, option]) => (
                    <Listbox.Option
                      key={key}
                      value={option}
                      className={({ active }) =>
                        `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                            {option}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}

                </Listbox.Options>
              )}
            </div>
          )}

        </Listbox>

        <button
          className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"

          onClick={handleSudokuCreate}
        >
          Unirse a partida
        </button>

        <button
          className={`bg-purple-400  text-white text-xl font-bold transition-colors px-10 py-3
            ${!lastGameObj
              ? 'opacity-50 cursor-default'
              : 'cursor-pointer hover:bg-purple-600'}`}
          disabled={!lastGameObj}
          onClick={handleLastGame}
        >Volver a la partida</button>
      </div>






    </>
  )
}


