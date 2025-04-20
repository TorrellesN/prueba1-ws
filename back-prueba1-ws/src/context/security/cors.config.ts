import { CorsOptions } from 'cors';
import dotenv from 'dotenv';


dotenv.config();

//const allowedOrigins = ["http://localhost:5173"];
//const options: cors.CorsOptions = {origin: allowedOrigins};

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        console.log('sdgfsdgsdgsdg', process.env.FRONTEND_URL)
        const whitelist = [process.env.FRONTEND_URL]
        
				// si ejecutamos ese run dev, habra un tercer arg llamado --api, y dejará entrar a todas las conexionesw
        if(process.argv.includes('--api')) {
            
            whitelist.push(undefined)
        }

        if(whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}