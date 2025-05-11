import { Server } from "socket.io"
import { UserAuth } from "../../../users/domain/User";
import { Socket } from "socket.io";
import { CellToInsert, Difficulty } from "../../../sudokus/domain/Sudoku";
import SudokuUseCases from "../../../sudokus/application/sudoku.useCases";
import { SocketCallback } from "../types";

export default function registerPveEvents(
    socket: Socket,
    user: UserAuth,
    io: Server,
    sudokuUseCases: SudokuUseCases
) {
        
        socket.on('request-sudoku-pve', async ( difficulty: Difficulty, callback: SocketCallback) => {

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

        socket.on('save-pve-move', async (cellToInsert: CellToInsert, pointsForSaving: number, callback: SocketCallback) => {
            //TODO: cuando implemente ls, igual es mejor rescatar room de los params de los headers del socket
            try {
                const sudokuRoom = Array.from(socket.rooms).find((room) => room !== socket.id);

                if (!sudokuRoom) {
                    throw new Error('401');
                }
                console.log('sudokuRoom: ', sudokuRoom);
                const { row, col, value } = cellToInsert;

                const confirmMessage = await sudokuUseCases.insertSudokuMovePve(
                    sudokuRoom!, { row, col, value, rol: 1 }, pointsForSaving
                );

                if (confirmMessage === 'partida terminada') {
                    try {
                        //TODO: en pvp añadimos logica para ganadores/perdedores. en pve no suma nada en la liga.
                        await sudokuUseCases.finishGamePve(sudokuRoom);

                        io.to(sudokuRoom).emit('sudoku-finished', { message: 'partida terminada' });
                        if (typeof callback === 'function') callback({ success: true, payload: 'finished' });

                    } catch (error) {
                        console.log(error)
                        if (typeof callback === 'function') callback({ success: false, payload: 'Lo sentimos, estamos teniendo problemas en servidor.' });
                    }


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


        socket.on('reset-pve-combo', async (callback: SocketCallback) => {
            try {
                const sudokuId = Array.from(socket.rooms).find((room) => room !== socket.id);

                const isDeleted = await sudokuUseCases.resetComboPve(sudokuId!);
                if (isDeleted && typeof callback === 'function') callback({ success: true, payload: '' });
                if (!isDeleted && typeof callback === 'function') callback({ success: false, payload: '' });
            } catch (error) {
                if (typeof callback === 'function') callback({ success: false, payload: '' });
            }
        })


        socket.on('quit-pve-game', async () => {
            try {
                const sudokuId = Array.from(socket.rooms).find((room) => room !== socket.id);
            await sudokuUseCases.leaveGamePve(sudokuId!);
            socket.leave(sudokuId!);
            } catch (error) {
                console.log(error)
            }

        })


        socket.on('reconnect-to-pve-game', async (sudokuId: string, callback: SocketCallback) => {
            try {
                const sudokuObj = await sudokuUseCases.getSudokuByIdPve(sudokuId);
                socket.join(sudokuId);
                callback({ success: true, payload: sudokuObj });
            } catch (error) {
                if (typeof callback === 'function') callback({ success: false, payload: '' });
                
            }
        })

    }