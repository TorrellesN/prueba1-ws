import { createContext, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { Socket } from "socket.io-client";

type SocketContextProps = {
    online: boolean,
    socket: Socket,
    connectSocket: () => void,
    disconnectSocket: () => void
}

export const SocketContext = createContext<SocketContextProps>(null!);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { socket, online, connectSocket, disconnectSocket } = useSocket(
        import.meta.env.VITE_API_URL_DEVELOPMENT_SOCKET,
        ['/pve', '/pvp']
    );

    const listenersRegistered = useRef(false);

    useEffect(() => {
        if (online && !listenersRegistered.current) {
            console.log('conexion establecida');
            listenersRegistered.current = true;
        } else if (!online) {
            console.log('desconectando');
            listenersRegistered.current = false;
        }
        return () => {
        }
    }, [online]);

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

