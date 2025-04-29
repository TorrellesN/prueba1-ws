import { useCallback, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import { useAppStore } from "../store/useAppStore";
import { useLocation } from "react-router-dom";


//! ESTE HOOK SOLO SE UTILIZA A TRAVES DE SOCKET CONTEXT
export const useSocket = (serverPath: string, allowedRoutes: string[]) => {
    const token = useAppStore((state) => state.token);
    const {pathname} = useLocation();
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
        if (!token) return;
       socket.current.connect();

    }, [socket, token])

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

    //para logout
    useEffect(() => {
        /* if(token) {
            connectSocket();
        } */
        if(!token) {
            disconnectSocket();
        }
    }, [token, disconnectSocket])

    useEffect(() => {
        const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));
        console.log('no entra')
        if (isAllowed) {
          connectSocket();
        } else {
          disconnectSocket();
        }
}, [connectSocket, disconnectSocket, pathname])

    
    return {
        socket: socket.current,
        online,
        connectSocket,
        disconnectSocket
    }

}