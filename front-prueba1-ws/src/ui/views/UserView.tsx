import { Link, useNavigate } from 'react-router-dom'
import { SocketContext } from '../../application/context/socketContext'
import { useContext, useState } from 'react';
import { useAppStore } from '../../application/store/useAppStore';

export default function HomeView() {

  const {online, connectSocket} = useContext(SocketContext);
  const navigate = useNavigate();
  const user = useAppStore(state => state.user)



  return (
    <>
    <h1 className="text-5xl font-black">Prueba</h1>
    <p className="text-2xl font-light text-gray-500 mt-5">
      Bienvenido, {user.username || ''}
    </p>
    

    <nav className="my-5">
    <button
        className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        onClick = {() =>  navigate('/pve/create')}
      >
        Un jugador
      </button>

      <button
        className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        onClick = {() =>  navigate('/pvp/create')}
      >
        Multijugador
      </button>
    </nav>
    
        <p className="text-center py-20">No hay sudokus aún {''}
          <Link
            className="text-fuchsia-500 font-bold"
            to='/pve/create'
          >Crear sudokus</Link>
        </p>
        <button className='button bg-amber-100 cursor-pointer'
        onClick={connectSocket}
        >{online ? 'Online' : 'Offline'}</button>
      

    
  </>
  )
}
