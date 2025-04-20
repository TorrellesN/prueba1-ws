import { Link, useNavigate } from 'react-router-dom'
import { SocketContext } from '../utilities/context/socketContext'
import { useContext, useState } from 'react';
import { UserContext } from '../utilities/context/userContext';
import { Button, CloseButton, PopoverButton } from '@headlessui/react';

export default function HomeView() {

  const {online, connectSocket} = useContext(SocketContext);
  const {loginFake} = useContext(UserContext)
  const [name, setName] = useState('');
  const navigate = useNavigate();

/*   useEffect(()=>{
    console.log('sdf')
    connectSocket();
    console.log(online)
  }, [online]) */

  const handleRedirectEnter = () => {
    loginFake(name);
    navigate('/oneplayer/create');
  }

  return (
    <>
    <h1 className="text-5xl font-black">Prueba</h1>
    <p className="text-2xl font-light text-gray-500 mt-5">
      Introduce tu nombre de usuario
    </p>
    <input type="text" className='font-sm input w-xl border border-gray-400 hover:border-gray-500'
    value= {name}
    onChange = {(e) => setName(e.target.value)}
    />

    <nav className="my-5">
      <button
        className="bg-purple-400 hover:bg-purple-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
        onClick = {handleRedirectEnter}
      >
        Entrar
      </button>
    </nav>
    
        <p className="text-center py-20">No hay sudokus aún {''}
          <Link
            className="text-fuchsia-500 font-bold"
            to='/projects/create'
          >Crear sudokus</Link>
        </p>
        <button className='button bg-amber-100 cursor-pointer'
        onClick={connectSocket}
        >{online ? 'Online' : 'Offline'}</button>
      

    
  </>
  )
}
