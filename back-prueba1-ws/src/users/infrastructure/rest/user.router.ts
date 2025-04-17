import express, { Request, Response } from "express";
import Usuario, { UserAuth } from "../../domain/User";
import { createTokenUser, isAuth, isUser } from "../../../context/security/auth";
import UserUseCases from "../../application/user.useCases";
import UserRepositoryPostgreSQL from "../db/user.repository.postgresql";
import User from "../../domain/User";

const router = express.Router();
const userUseCases: UserUseCases = new UserUseCases(new UserRepositoryPostgreSQL)

router.post('/register', rtRegister);
router.post('/login', rtLogin);

async function rtRegister (req: Request, res: Response) {
    try {
        const { username, pwd, email } = req.body;
        
        const message: string = await userUseCases.register({email, pwd, username});
        res.status(201).json({message: message});
        
        /* res.status(200).send('response ok'); */

    } catch (error) {
        res.status(500).json({ message: String(error) });
    }
}

async function rtLogin (req: Request, res: Response) {
    try {
        const { pwd, email } = req.body;
        const user: UserAuth = await userUseCases.login({email, pwd})
        
        const token: string =  createTokenUser(user);
        res.status(200).send({
            
                user: {
                    username: user.username
                },
                token: token
            
            
            
        });

    } catch (error) {
        res.status(500).send({ message: String(error) });
    }
}


export default router;