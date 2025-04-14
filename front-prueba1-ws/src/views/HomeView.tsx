import { Link } from 'react-router-dom'
import { SocketContext } from '../utilities/context/socketContext'
import { useContext } from 'react';

export default function HomeView() {

  const {online, connectSocket} = useContext(SocketContext);
  return (
    <>
    <h1 className="text-5xl font-black">Mis proyectos</h1>
    <p className="text-2xl font-light text-gray-500 mt-5">
      Maneja y administra tus proyectos
    </p>

    <nav className="my-5">
      <Link
        className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        to="/projects/create"
      >
        Nuevo proyecto
      </Link>
    </nav>
    
        <p className="text-center py-20">No hay proyectos aún {''}
          <Link
            className="text-fuchsia-500 font-bold"
            to='/projects/create'
          >Crear proyecto</Link>
        </p>
        <button className='button bg-amber-100 cursor-pointer'
        onClick={connectSocket}
        >{online ? 'Online' : 'Offline'}</button>
      

    
  </>
  )
}
