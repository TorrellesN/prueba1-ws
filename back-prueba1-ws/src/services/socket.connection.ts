import { Server } from "socket.io"

export default function configureSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado con id: ' + socket.id);

        socket.conn.on("upgrade", (transport) => {
            console.log(`Socket actualizado a: ${transport.name}`); // Debería mostrar "websocket"
          });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        })
    });
    
}