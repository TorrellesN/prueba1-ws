import userRouter from "../users/infrastructure/rest/user.router";
import { Application } from "express";

export default function configureAppRoutes (app: Application) {
    app.use(`/api/users`, userRouter);
}