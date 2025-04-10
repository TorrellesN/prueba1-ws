import cors from 'cors';
import express, { Request, Response } from "express";
import http from 'http';
import logger from "morgan";
import { Server } from 'socket.io';
import { createMongoConnectionDefault } from './context/db/mongodb.connection';
import configureSocket from './services/socket.connection';
import usuarioRouter from "./usuarios/infrastructure/rest/usuario.router";
import configureAppRoutes from './services/app.routes';
import { corsConfig } from './context/security/cors.config';
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../doc/swagger.json");


createMongoConnectionDefault();

const allowedOrigins = ["http://localhost:5173"];
const options: cors.CorsOptions = {origin: allowedOrigins};


const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));
app.use(cors(corsConfig));

configureAppRoutes(app);

const server = http.createServer(app);
const io = new Server(server, {
    cors: options,
    connectionStateRecovery: {} //le puedo pasar un objeto con el tiempo maximo de reconexion
});

configureSocket(io);

export default server;
