import express, { Request, Response } from "express";
import Usuario from "../../domain/Usuario";
import { createTokenUser, isAuth, isUser } from "../../../context/security/auth";

const router = express.Router();



router.post(`/registro`, async (req: Request, res: Response) => {

    try {
        const { alias, pwd, correo, nombre, apellidos } = req.body;
        
        res.status(200).send();

    } catch (error) {
        res.status(500).send({ message: String(error) });
    }

});


export default router;