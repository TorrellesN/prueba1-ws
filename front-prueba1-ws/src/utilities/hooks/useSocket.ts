import { useCallback, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import { useAppStore } from "../store/useAppStore";

export const useSocket = (serverPath: string) => {
    const token = useAppStore((state) => state.token);
    const [online, setOnline] = useState(false);

    const socket = useRef(io(serverPath, {
        transports: ['websocket'],
        autoConnect: false,
        //forceNew: true,
        query: {
            authToken: token
        }
    }));

    const connectSocket = useCallback(() => {
        //const token = localStorage.getItem('token');
        //if ( auth.logged )...
       socket.current.connect();

    }, [])

    const disconnectSocket = useCallback( () => {
        socket.current.disconnect();
    },[ socket ]);

    useEffect(() => {
        setOnline( socket.current.connected );
    }, [socket])

    useEffect(() => {
        socket.current.on('connect', () => setOnline( true ));
    }, [ socket ])

    useEffect(() => {
        socket.current.on('disconnect', () => setOnline( false ));
    }, [ socket ])

    //solo para comprobar token
    useEffect(() => {
        if(token) {
            connectSocket();
        }
        if(!token) {
            disconnectSocket();
        }
    }, [token, disconnectSocket, connectSocket])

    
    return {
        socket: socket.current,
        online,
        connectSocket,
        disconnectSocket
    }

}