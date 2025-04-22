import { Server } from "socket.io"
import { decryptJWT } from "../context/security/auth";
import UserUseCases from "../users/application/user.useCases";
import { UserAuth } from "../users/domain/User";

export default function configureSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado con id: ' + socket.id);
        const userAuth = decryptJWT( String(socket.handshake.query.authToken) );
        if (!userAuth || 'response' in userAuth) {
            return socket.disconnect();
        }
        const user = userAuth as UserAuth;

        socket.on('request-sudoku', (gameMode, difficulty) => {
            console.log(gameMode, difficulty)
        } )


        socket.conn.on("upgrade", (transport) => {
            console.log(`Socket actualizado a: ${transport.name}`); // Debería mostrar "websocket"
          });

        socket.on('disconnect', () => {
            console.log('Usuario desconectado');
        })
    });
    
}