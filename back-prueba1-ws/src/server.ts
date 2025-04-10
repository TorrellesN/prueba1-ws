import cors from 'cors';
import express,{ Request, Response } from "express";
import usuarioRouter from "./usuarios/infrastructure/rest/usuario.router"
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../doc/swagger.json");

/* createMongoConnectionDefault(); */
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const allowedOrigins = ["http://localhost:5173"];
const options: cors.CorsOptions = {origin: allowedOrigins};
app.use(cors(options));

app.use(`/api/usuarios`, usuarioRouter);

export default app;
