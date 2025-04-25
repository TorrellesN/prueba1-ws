import { Server } from "socket.io"
import { decryptJWT } from "../context/security/auth";
import UserUseCases from "../users/application/user.useCases";
import { UserAuth } from "../users/domain/User";
import { Difficulty } from "../sudokus/domain/Sudoku";
import SudokuUseCases from "../sudokus/application/sudoku.useCases";
import SudokuRepositoryMongoDB from "../sudokus/infrastructure/bd/sudoku.repository.mongodb";

const sudokuUseCases: SudokuUseCases = new SudokuUseCases(new SudokuRepositoryMongoDB());

export default function configureSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado con id: ' + socket.id);
        const decryptedUser = decryptJWT(String(socket.handshake.query.authToken));
        if (!decryptedUser || 'response' in decryptedUser) {
            return socket.disconnect();
            //TODO: ver si puedo hacer esta función con algún callback para que user tenga que iniciar sesión de nuevo
        }
        const user = decryptedUser as UserAuth; //


        socket.on('request-sudoku', async (gameMode: 'pve' | 'pvp', difficulty: Difficulty, callback) => {
            console.log(gameMode, difficulty);

            const sudokuPuzzle = await sudokuUseCases.createPve(user, difficulty);
            /* socket.emit('generate-sudoku', sudokuPuzzle); */
            callback({ success: true, message: 'Sudoku data'});
        });

        socket.on('insert-number', async (CellToInsert) => {
            //TODO: primero debo ingresar en la bd porque server no almacena el sudoku
            //TODO: control de errores. En la consulta:
            // 1-Comprobar el id del sudoku. 
            // 2-Comprobar que el número que se quiere insertar está en valor null.
            // 3-Comprobar que el número es igual al del resolved.(esto debería hacerse en frontend antes de nada)
        })




        socket.conn.on("upgrade", (transport) => {
            console.log(`Socket actualizado a: ${transport.name}`); // Debería mostrar "websocket"
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        })
    });

}