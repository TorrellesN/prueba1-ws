import { createContext, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { Socket } from "socket.io-client";


type SocketContextProps = {
    online: boolean,
    socket: Socket,
    connectSocket:  () => void,
    disconnectSocket:  () => void
}

export const SocketContext = createContext<SocketContextProps>(null!); 


export const SocketProvider = ({children}: {children : React.ReactNode}) => {

    const { socket, online, connectSocket, disconnectSocket } = useSocket('http://localhost:4000');

    useEffect(() => {
        if (online) {
            socket.on( 'prueba-evento', (usuarios) => {
               console.log('recibido')
            })
        } else {
            socket.off('lista-usuarios')
        }

        return () => {
            socket.off('lista-usuarios')
        }

    }, [ online ]);

    /* const enviarMensaje = useCallback((mensaje) => {
        socket.current.emit('mensaje', mensaje);
        }, []); */


    return (
        <SocketContext.Provider value={{
            online,
            socket,
            connectSocket,
            disconnectSocket
        }}>
        {children}
        </SocketContext.Provider>
    )

}

