import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../application/context/socketContext'
import { UserContext } from '../../../application/context/userContext';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../application/store/useAppStore';
import PVESudokuBoard from './PVESudokuBoard';

export default function PVESudokuView() {
  
    const {socket, connectSocket, disconnectSocket, online} = useContext(SocketContext);
    const user = useAppStore((state) => state.user);
    const current = useAppStore((state) => state.current);


    const handleCellClick = (row: number, col: number) => {
      console.log(`Celda seleccionada: ${row}, ${col}`);
      // Aquí puedes agregar la lógica para manejar la selección de celdas
    };

    if (!online) return <></>
    if (!user.username) return (<p className="text-2xl font-light text-gray-500 mt-5">
        Necesitas autenticarte para poder jugar. <Link to={'/auth/login'}>Iniciar sesión</Link>
      </p>)

    return (
    <div>
      <h1 className="text-5xl font-black">Sudoku un jugador</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Sudoku de {user.username}
      </p>
      <PVESudokuBoard currentSudoku={current} onCellClick={handleCellClick} />
    </div>
  )
}



