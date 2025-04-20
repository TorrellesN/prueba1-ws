import express, { Request, Response } from "express";
import Usuario, { UserAuth } from "../../domain/User";
import { createTokenUser, isAuth } from "../../../context/security/auth";
import UserUseCases from "../../application/user.useCases";
import UserRepositoryPostgreSQL from "../db/user.repository.postgresql";
import User from "../../domain/User";

const router = express.Router();
const userUseCases: UserUseCases = new UserUseCases(new UserRepositoryPostgreSQL)

router.post('/register', rtRegister);
router.post('/login', rtLogin);
router.get('/private', isAuth, rtPrivate);

async function rtRegister (req: Request, res: Response) {
    try {
        const { username, pwd, email } = req.body;
        
        const message: string = await userUseCases.register({email, pwd, username});
        res.status(201).json({message: 'ok'});
        
        /* res.status(200).send('response ok'); */

    } catch (error) {
        const err = error as Error;
        if (err.message === '409') {
            res.status(409).json({ message: 'Usuario ya existe'});
        } else {
            res.status(500).json({ message : "Error desconocido" });
        }
    }
}

async function rtLogin (req: Request, res: Response) {
    try {
        const { pwd, email } = req.body;
        const user: UserAuth = await userUseCases.login({email, pwd})
        
        const token: string =  createTokenUser(user);
        res.status(200).send({
            
                    user: user,
                token: token
            
        });

    } catch (err) {
        const error = err as Error;
    if (error.message === '401') {
      res.status(401).json({ message : "No autorizado" });
    } else if (error.message === '404') {
        res.status(404).json({ message : "No se ha podido logear" });
    } else {
        res.status(500).json({ message : "Error desconocido" });
    }
    }
}

async function rtPrivate (req: Request, res: Response) {
    try {
        const {username, email, profileImg} = req.body.auth;
        const userAuth: UserAuth = {username, email, profileImg};

        res.json({message: 'Accediendo a zona personal',
            userAuth:  userAuth
        })

    } catch (error) {
        res.status(500).send({ message: String(error) });
    }
}



export default router;