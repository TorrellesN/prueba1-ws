import request from 'supertest';
import app from '../src/server'
import createMongoConnection,{collections, closeMongoConnection} from '../src/context/db/mongodb.connection';

const userPrueba = {
    alias: 'userTesing',
    pwd: 'password12',
    correo: 'user1@',
    nombre: 'user',
    apellidos: 'user'
}

let token = "";
describe('API E2E Tests Usuario login', () => {

    it("POST /login debe incluir message: Error: usuario o contraseña incorrectos", async () => {

        const response = await request(app)
        .post('/api/usuarios/login')
        .send({alias: 'userTestMal', pwd: 'password2'})
        .set("Content-Type", "application/json");
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({message: "Error: Faltan datos para poder iniciar sesión"});

    });

    
});

