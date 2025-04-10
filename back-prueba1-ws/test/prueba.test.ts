import app from '../src/server';
import request from 'supertest';


describe('PRUEBA', () => {
 it('pruebita', () => {
    const objPrueba =  {
        key: "hola"
    }
    expect(objPrueba.key).toBe("hola");
 })
})