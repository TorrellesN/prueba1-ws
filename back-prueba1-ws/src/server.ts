import cors from 'cors';
import express from "express";
import http from 'http';
import logger from "morgan";
import { Server } from 'socket.io';
import { createMongoConnectionDefault } from './context/db/mongodb.connection';
import { corsConfig } from './context/security/cors.config';
import configureAppRoutes from './services/app.routes';
import configureSocket from './services/socket.connection';
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
    cors: corsConfig,
    connectionStateRecovery: {} //le puedo pasar un objeto con el tiempo maximo de reconexion
});

configureSocket(io);

export default server;
