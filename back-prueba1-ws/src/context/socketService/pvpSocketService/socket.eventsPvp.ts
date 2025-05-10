import { Server, Socket } from "socket.io";
import SudokuUseCases from "../../../sudokus/application/sudoku.useCases";
import { UserAuth } from "../../../users/domain/User";
import { CellToInsert, Difficulty } from "../../../sudokus/domain/Sudoku";
import { SavedMoveUseCasesResponse, SocketCallback } from "../types";


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

        //si existe en otra sala se le quita 
        if (currentRoom) {
            try {
                console.log(`User ${user.username} already in room ${currentRoom}, removing first`);
                await sudokuUseCases.quitUserFromSudokuPvp(user.email, currentRoom, currentDifficulty!);
                socket.leave(currentRoom);
                io.to(currentRoom).emit('player-disconnected', { username: user.username });
                currentRoom = null;
                currentDifficulty = null;
            } catch (error) {
                console.log('Error al salir de la sala previa: ' + error);
            }
        }
        //comprobación adicional para otras salas
        const socketRooms = Array.from(socket.rooms).filter(room => room !== socket.id);
        if (socketRooms.length > 0) {
            console.log(`Leaving ${socketRooms.length} additional rooms`);
            socketRooms.forEach(room => {
                socket.leave(room);
            });
        }

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


    socket.on('set-ready', async (username: string, areAllReady: boolean) => {
        let sudokuId = Array.from(socket.rooms).find((room) => room !== socket.id);

        if (!sudokuId) {
            sudokuId = currentRoom!;
            socket.join(sudokuId);
        }
        
        socket.to(sudokuId).emit('player-ready', { username: username });
        
        if (areAllReady) {
            console.log(1)
            try {
                await sudokuUseCases.startGamePvp(sudokuId, currentDifficulty!);
                io.to(sudokuId).emit('all-players-ready', {data: sudokuId});
            } catch (error) {
                console.log('Error al iniciar el juego: ' + error);
            }
        }
    });


    socket.on('set-waiting', (sudokuId: string, username: string) => {
        console.log('set-waiting', sudokuId, username);
        socket.to(sudokuId).emit('player-waiting', { username: username });
    });


    socket.on('save-pvp-move', async (cellToInsert: CellToInsert, pointsForSaving: number, difficulty: Difficulty, callback: SocketCallback) => {
        //TODO: cuando implemente ls, igual es mejor rescatar room de los params de los headers del socket
        try {
            const sudokuRoom = Array.from(socket.rooms).find((room) => room !== socket.id);

            if (!sudokuRoom) {
                throw new Error('401');
            }
            const { row, col, value, rol } = cellToInsert;

            const bdSavedMove: SavedMoveUseCasesResponse = await sudokuUseCases.insertSudokuMovePvp(
                sudokuRoom!, difficulty, { row, col, value, rol }, pointsForSaving
            );

            if (bdSavedMove.message === 'partida terminada') {
                try {
                    //TODO: en pvp añadimos logica para ganadores/perdedores. llama a postgre para actualizar
                    await sudokuUseCases.finishGamePve(sudokuRoom);

                    io.to(sudokuRoom).emit('sudoku-finished', { message: 'partida terminada' });
                    if (typeof callback === 'function') callback({ success: true, payload: 'finished' });

                } catch (error) {
                    console.log(error)
                    if (typeof callback === 'function') callback({ success: false, payload: 'Lo sentimos, estamos teniendo problemas en servidor.' });
                }


            }
            if (bdSavedMove.message === 'movimiento guardado') {
                if (typeof callback === 'function') {
                    socket.to(sudokuRoom!).emit('player-pvp-move', { cellToInsert, player: bdSavedMove.player });
                    callback({ success: true, payload: 'movimiento guardado' });
                }
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