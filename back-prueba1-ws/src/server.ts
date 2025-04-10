import cors from 'cors';
import express,{ Request, Response } from "express";
import usuarioRouter from "./usuarios/infrastructure/rest/usuario.router"
import { corsConfig } from './context/security/cors.config';
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../doc/swagger.json");

/* createMongoConnectionDefault(); */
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(cors(corsConfig));

app.use(`/api/usuarios`, usuarioRouter);
app.use(`/api/pruebas`, pruebaRouter);

export default app;
