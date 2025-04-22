import { NextFunction, Request, Response } from "express";
import Usuario, { UserAuth } from "../../users/domain/User";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import User from "../../users/domain/User";

const SECRET_KEY: Secret = "mi-Secreto-Para-Ganar-Sudokus-Es-La-Paciencia";

const createTokenUser = (user: User): string => {
 
    const payload = {
      username: user.username,
      email: user.email,
      profileImg: user.profileImg
    }
  
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};

/* const createTokenTienda = (tienda: Tienda): string => {
  const payload = {
    correo: tienda.correo,
    alias: tienda.alias,
    foto: tienda.foto,
    marca: tienda.marca
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });

} */

const isAuth = (req: Request, response: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];
    if (token) {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      req.body.auth = {
        username: decoded.username,
        email: decoded.email,
        profileImg: decoded.profileImg,
      }
        
      next();
    }
  } catch (err) {
    response.status(401).json({ message : "No autorizado" });
  }
};

/* const isTienda = async (req: Request, res: Response, next: NextFunction) => {
  try {
      if (!req.body.auth.marca) {
        throw new Error('Usuario no autorizado.')
      }

      next();
      
    } catch (error) {
      res.status(401).send(String(error))
    }
  
}

const isUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.auth.marca) {
      throw new Error('Usuario no autorizado.')
    }
    console.log('Usuario autorizado');
    next();
    
  } catch (error) {
    res.status(401).send({message: String(error)})
  }

} */

  const decryptJWT = (token: string): UserAuth | {response: string} => {
    try {
      if (token) {
        const decoded: any = jwt.verify(token, SECRET_KEY);
        const userAuth: UserAuth = {
          username: decoded.username,
          email: decoded.email,
          profileImg: decoded.profileImg,
        }
          
        return userAuth
      } else {
      return {response: 'Token no válido'}
      }
    } catch (err) {
      return {response: 'Token no válido'}
    }
  };

export { createTokenUser, isAuth, decryptJWT };