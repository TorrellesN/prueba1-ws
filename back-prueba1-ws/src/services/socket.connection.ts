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
        const userAuth = decryptJWT( String(socket.handshake.query.authToken) );
        if (!userAuth || 'response' in userAuth) {
            return socket.disconnect();
        }
        const user = userAuth as UserAuth;

         socket.on('request-sudoku', async (gameMode: 'pve' | 'pvp', difficulty: Difficulty) => {
            console.log(gameMode, difficulty);

            const sudokuPuzzle = await sudokuUseCases.createPve(userAuth, difficulty);
            socket.emit('sudoku-puzzle', sudokuPuzzle);
            // callback({ success: true, message: 'Sudoku data'});
        } )


        socket.conn.on("upgrade", (transport) => {
            console.log(`Socket actualizado a: ${transport.name}`); // Debería mostrar "websocket"
          });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        })
    });
    
}