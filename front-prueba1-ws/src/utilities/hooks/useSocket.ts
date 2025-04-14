import { useCallback, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";

export const useSocket = (serverPath: string) => {

    const socket = useRef(io(serverPath, {
        transports: ['websocket'],
        autoConnect: false,
        //forceNew: true,
        /* query: {
            'x-token': token
        } */
    }));
    const [online, setOnline] = useState(false);

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

    
    return {
        socket: socket.current,
        online,
        connectSocket,
        disconnectSocket
    }

}