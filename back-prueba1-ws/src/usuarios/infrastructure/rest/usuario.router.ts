import express, { Request, Response } from "express";
import Usuario from "../../domain/Usuario";
import { createTokenUser, isAuth, isUser } from "../../../context/security/auth";

const router = express.Router();



router.post(`/register`, async (req: Request, res: Response) => {

    try {
        const { alias, pwd } = req.body;
        
        res.status(200).send('response ok');

    } catch (error) {
        res.status(500).send({ message: String(error) });
    }

});


export default router;