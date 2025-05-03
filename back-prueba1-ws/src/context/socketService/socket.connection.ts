import { Server } from "socket.io";
import SudokuUseCases from "../../sudokus/application/sudoku.useCases";
import SudokuRepositoryMongoDB from "../../sudokus/infrastructure/bd/sudoku.repository.mongodb";
import { UserAuth } from "../../users/domain/User";
import { decryptJWT } from "../security/auth";
import registerPveEvents from "./pveSocketService/socketPveEvents";
import { SocketCallback } from "./types";
import registerPvpEvents from "./pvpSocketService/socketPvpEvents";

const sudokuUseCases: SudokuUseCases = new SudokuUseCases(new SudokuRepositoryMongoDB());

export default function configureSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado con id: ' + socket.id);
        const decryptedUser = decryptJWT(String(socket.handshake.query.authToken));
        if (!decryptedUser || 'response' in decryptedUser) {
            return socket.disconnect();
            //TODO: ver si puedo hacer esta función con algún callback para que user tenga que iniciar sesión de nuevo
        }
        const user = decryptedUser as UserAuth;
        registerPveEvents(socket, user, io, sudokuUseCases);
        registerPvpEvents(socket, user, io, sudokuUseCases);
       


        socket.on('finish-now', async (callback: SocketCallback) => {
            try {
                const sudokuId = Array.from(socket.rooms).find((room) => room !== socket.id);
                if (!sudokuId && typeof callback === 'function') callback({ success: false, payload: 'No room' });
                console.log('sudokuId: ', sudokuId);
                const isFinishingUpdate = await sudokuUseCases.finishNow(sudokuId!);
                if (isFinishingUpdate && typeof callback === 'function') callback({ success: true, payload: '' });
                if (!isFinishingUpdate && typeof callback === 'function') callback({ success: false, payload: '' });
            } catch (error) {
                console.log(error)
                if (typeof callback === 'function') callback({ success: false, payload: '' });
            }
        })




        socket.conn.on("upgrade", (transport) => {
            console.log(`Socket actualizado a: ${transport.name}`); // Debería mostrar "websocket"
        });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        })
    });

}