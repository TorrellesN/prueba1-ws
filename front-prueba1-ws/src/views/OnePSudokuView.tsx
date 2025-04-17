import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../utilities/context/socketContext'
import { UserContext } from '../utilities/context/ userContext';
import { Link } from 'react-router-dom';

export default function OnePSudokuView() {
  
    const {socket, connectSocket, disconnectSocket, online} = useContext(SocketContext);
    const {user} = useContext(UserContext);

    useEffect(() => {
        
        if (user.username) {
            
            connectSocket();
            socket.on('connect', () => console.log('conectado con ', socket.id))

        } else {
            disconnectSocket();
            
        }

    }, [])
  

    if (!online) return <></>
    if (!user.username) return (<p className="text-2xl font-light text-gray-500 mt-5">
        Necesitas autenticarte para poder jugar. <Link to={'/'}>Iniciar sesión</Link>
      </p>)

    return (
    <div>
      <h1 className="text-5xl font-black">Sudoku un jugador</h1>
    <p className="text-2xl font-light text-gray-500 mt-5">
      Sudoku de {user.username}
    </p>
    </div>
  )
}



