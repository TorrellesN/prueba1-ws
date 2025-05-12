import { useCallback, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import { useAppStore } from "../store/useAppStore";
import { useLocation } from "react-router-dom";

export const useSocket = (serverPath: string, allowedRoutes: string[]) => {
    const token = useAppStore((state) => state.token);
    const {pathname} = useLocation();
    const [online, setOnline] = useState(false);
    const reconnectFlag = useRef(false);

    const socket = useRef(io(serverPath, {
        transports: ['websocket'],
        autoConnect: false,
        query: {
            authToken: token
        }
    }));

    useEffect(() => {
        // Configuración inicial del socket
        if (!socket.current) {
            socket.current = io(serverPath, {
                transports: ['websocket'],
                autoConnect: false,
                query: { authToken: token }
            });
        } else {
            // Cuando el token cambia:
            // 1. Desconecta el socket existente
            if (socket.current.connected) {
                socket.current.disconnect();
            }
            
            // 2. Actualiza el query parameter
            socket.current.io.opts.query = { authToken: token };
            
            // 3. Vuelve a conectar (si estaba conectado previamente)
            if (reconnectFlag.current) {
                socket.current.connect();
            }
        }
    
        // Limpieza al desmontar el componente
        return () => {
            reconnectFlag.current = socket.current.connected;
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [token, serverPath]); // Este efecto se ejecuta cuando el token cambia

    const connectSocket = useCallback(() => {
        if (!token) return;
        // Evitar conexiones duplicadas
        if (!socket.current.connected) {
            socket.current.connect();
        }
    }, [token]);

    const disconnectSocket = useCallback(() => {
        if (socket.current.connected) {
            socket.current.disconnect();
        }
    }, []);

    // Actualizar estado online cuando cambia la conexión
    useEffect(() => {
        const handleConnect = () => setOnline(true);
        const handleDisconnect = () => setOnline(false);
        
        socket.current.on('connect', handleConnect);
        socket.current.on('disconnect', handleDisconnect);
        
        // Inicializar estado
        setOnline(socket.current.connected);
        
        return () => {
            socket.current.off('connect', handleConnect);
            socket.current.off('disconnect', handleDisconnect);
        };
    }, []);

    // Manejo de conexión basado en rutas
    useEffect(() => {
        const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));
        
        if (isAllowed) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [pathname, connectSocket, disconnectSocket]);
    
    return {
        socket: socket.current,
        online,
        connectSocket,
        disconnectSocket
    };
}