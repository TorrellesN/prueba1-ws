import { NextFunction, Request, Response } from "express";
import Usuario from "../../usuarios/domain/Usuario";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

const SECRET_KEY: Secret = "mySecretKey";

const createTokenUser = (usuario: Usuario): string => {
 
    const payload = {
      correo: "",
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
        correo: decoded.correo,
        alias: decoded.alias,
        foto: decoded.foto,
        ...(decoded.marca && { marca: decoded.marca })
      }
        
      next();
    }
  } catch (err) {
    response.status(401).json({ message : "No autorizado" });
  }
};

const isTienda = async (req: Request, res: Response, next: NextFunction) => {
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

}

export { createTokenUser, isAuth, isTienda, isUser };