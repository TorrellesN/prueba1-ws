import usuarioRouter from "../usuarios/infrastructure/rest/usuario.router";
import { Application } from "express";

export default function configureAppRoutes (app: Application) {
    app.use(`/api/usuarios`, usuarioRouter);
}