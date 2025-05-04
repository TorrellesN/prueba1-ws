import { Server, Socket } from "socket.io";
import SudokuUseCases from "../../../sudokus/application/sudoku.useCases";
import { UserAuth } from "../../../users/domain/User";
import { Difficulty } from "../../../sudokus/domain/Sudoku";
import { SocketCallback } from "../types";
import { StringMap } from "ts-jest";


export default function registerPvpEvents(
    socket: Socket,
    user: UserAuth,
    io: Server,
    sudokuUseCases: SudokuUseCases
) {

    let currentRoom: string | null = null;
    let currentDifficulty: Difficulty | null = null;

    socket.on('request-sudoku-pvp', async (difficulty: Difficulty, callback: SocketCallback) => {
        console.log('Solicitud de sudoku PVP recibida')
        let roomIds: string[] = [];

        try {
            roomIds = await sudokuUseCases.findRoomsPvp(difficulty);
        } catch (error) {
            console.log('Error al buscar salas de sudoku: ' + error);
        }

        console.log('roomIds: ', roomIds);

        if (roomIds.length !== 0) {
            for (const room of roomIds) {
                console.log('Intentando unirse a la sala:', room)

                const roomExists = io.of("/").adapter.rooms.has(room);
                console.log('roomExists: ', roomExists);

                if (roomExists) {
                    try {
                        const sudokuJoinedObj = await sudokuUseCases.joinUserToSudokuPvp(user, room, difficulty);
                        const sudokuJoined = sudokuJoinedObj.sudoku;
                        const player = sudokuJoinedObj.player;

                        socket.join(room);
                        io.to(room).emit('player-joined', player);

                        console.log('Jugador unido a sala existente:', room);
                        currentRoom = room;
                        currentDifficulty = difficulty;
                        if (typeof callback === 'function') callback({ success: true, payload: { sudoku: sudokuJoined, player } });

                        return;
                    } catch (error) {
                        console.log('Error al unirse a la sala: sudoku con id ' + room + ' no existe o está llena, intentando en otra sala.');
                    }
                }
            }
        }

        try {
            console.log('Creando nueva sala de sudoku')
            const sudokuPvpWithPlayer = await sudokuUseCases.createPvp(user, difficulty);

            socket.join(sudokuPvpWithPlayer.sudoku.id!);
            console.log('Nueva ', sudokuPvpWithPlayer.sudoku.id);
            currentRoom = sudokuPvpWithPlayer.sudoku.id!;
            currentDifficulty = difficulty;
            sudokuPvpWithPlayer.sudoku.players = [];
            if (typeof callback === 'function') callback({ success: true, payload: sudokuPvpWithPlayer });
        } catch (error) {
            console.log('Error al crear el sudoku: ' + error);
            if (typeof callback === 'function') callback({ success: false, payload: 'No se ha podido encontrar una sala de este nivel, vuelve a intentarlo más adelante' });
        }
    })



    socket.on('quit-pvp-waiting', async (sudokuId: string, callback: SocketCallback) => {
        try {
            const isRemoved = await sudokuUseCases.quitUserFromSudokuPvp(user.email, sudokuId, currentDifficulty!);
            console.log('isRemoved: ', isRemoved);
            const username = user.username;

            if (isRemoved) {
                socket.leave(sudokuId);
                currentRoom = null;
                currentDifficulty = null;
                io.to(sudokuId).emit('player-disconnected', { username: username });
                if (typeof callback === 'function') callback({ success: true, payload: 'Has salido de la sala' });
            } else {
                if (typeof callback === 'function') callback({ success: false, payload: 'No se ha podido salir de la sala' });
            }
        } catch (error) {
            console.log('Error al salir de la sala: ' + error);
            if (typeof callback === 'function') callback({ success: false, payload: 'No se ha podido salir de la sala' });
        }
    })


    socket.on('set-ready', (sudokuId: string, username: string) => {
        console.log('user-ready: ', sudokuId, username);
        socket.to(sudokuId).emit('player-ready', { username: username });
    });


    socket.on('set-waiting', (sudokuId: string, username: string) => {
        console.log('set-waiting', sudokuId, username);
        socket.to(sudokuId).emit('player-waiting', { username: username });
    });




    // Manejar la desconexión del usuario
    /*  socket.on('disconnect', async () => {
        console.log('Usuario desconectado:', user.username);
        
        // Si el usuario estaba en una sala
        if (currentRoom && currentDifficulty) {
            try {
                // Verificar cuántos usuarios quedan en la sala
                const socketsInRoom = await io.in(currentRoom).fetchSockets();
                
                if (socketsInRoom.length <= 1) {  // Se considera <= 1 porque este socket aún no se ha eliminado completamente
                    console.log(`La sala ${currentRoom} quedará vacía. Eliminando de la base de datos.`);
                    
                    // Implementa este método en tu SudokuUseCases
                    await sudokuUseCases.handleEmptyRoomPvp(currentRoom, currentDifficulty);
                } else {
                    console.log(`El usuario ${user.username} abandonó la sala ${currentRoom}, pero quedan ${socketsInRoom.length - 1} usuarios.`);
                    
                    // Implementa este método en tu SudokuUseCases
                    await sudokuUseCases.handlePlayerDisconnectPvp(currentRoom, user.id, currentDifficulty);
                    
                    // Notificar a los demás usuarios en la sala
                    io.to(currentRoom).emit('player-disconnected', { userId: user.id, username: user.username });
                }
            } catch (error) {
                console.error(`Error al procesar la desconexión para la sala ${currentRoom}:`, error);
            }
        }
    }); */
}