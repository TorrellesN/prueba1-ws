import { Server } from "socket.io"
import { decryptJWT } from "../context/security/auth";
import { UserAuth } from "../users/domain/User";
import { CellToInsert, Difficulty } from "../sudokus/domain/Sudoku";
import SudokuUseCases from "../sudokus/application/sudoku.useCases";
import SudokuRepositoryMongoDB from "../sudokus/infrastructure/bd/sudoku.repository.mongodb";

const sudokuUseCases: SudokuUseCases = new SudokuUseCases(new SudokuRepositoryMongoDB());
type socketCallback = (response: { success: boolean, payload: any }) => void

export default function configureSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado con id: ' + socket.id);
        const decryptedUser = decryptJWT(String(socket.handshake.query.authToken));
        if (!decryptedUser || 'response' in decryptedUser) {
            return socket.disconnect();
            //TODO: ver si puedo hacer esta función con algún callback para que user tenga que iniciar sesión de nuevo
        }
        const user = decryptedUser as UserAuth;


        socket.on('request-sudoku', async (gameMode: 'pve' | 'pvp', difficulty: Difficulty, callback: socketCallback) => {

            if (typeof callback === 'function') {
                try {
                    const sudokuPuzzle = await sudokuUseCases.createPve(user, difficulty);
                    socket.join(sudokuPuzzle.id!);
                    callback({ success: true, payload: sudokuPuzzle });
                } catch (error) {
                    console.log('Error al crear el sudoku: ' + error);
                    callback({ success: false, payload: 'No se pudo generar el sudoku, vuelve a intentarlo más tarde.' });
                }
            }

        });

        socket.on('save-pve-move', async (cellToInsert: CellToInsert, pointsForSaving: number, callback: socketCallback) => {
            //TODO: cuando implemente ls, igual es mejor rescatar room de los params de los headers del socket
            try {
                const sudokuRoom = Array.from(socket.rooms).find((room) => room !== socket.id);

                if (!sudokuRoom) {
                    throw new Error('401');
                }
                console.log('sudokuRoom: ', sudokuRoom);
                const { row, col, value } = cellToInsert;

                const confirmMessage = await sudokuUseCases.insertSudokuPveMove(
                    sudokuRoom!, { row, col, value, rol: 1 }, pointsForSaving
                );

                if (confirmMessage === 'partida terminada') {
                    socket.to(sudokuRoom).emit('sudoku-finished', { message: 'partida terminada' });
                    //TODO: ver si puedo hacer un callback para que el cliente sepa que la partida ha terminado
                }
                if (confirmMessage === 'movimiento guardado') {
                    if (typeof callback === 'function') {
                        callback({ success: true, payload: 'movimiento guardado' });
                    }
                    //CODIGO PARA PVP para informar al resto a desarrollar:
                    // io.to(sudokuRoom).emit('sudoku-move', { message: 'movimiento guardado' });
                }

            } catch (error) {
                const e = error as Error;

                if (typeof callback === 'function') {
                    if (e.message === '404') {
                        callback({ success: false, payload: 'Parece que esa casilla ya está ocupada.' });
                    } else if (e.message === '401') {
                        callback({ success: false, payload: 'No ha sido posible guardar tu movimiento, recarga la página.' });
                    }
                }
            }

            //TODO: manejar error cuando no hay sudokuRoom, puedo desconectar el socket por ejemplo..
        })




        socket.conn.on("upgrade", (transport) => {
            console.log(`Socket actualizado a: ${transport.name}`); // Debería mostrar "websocket"
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        })
    });

}