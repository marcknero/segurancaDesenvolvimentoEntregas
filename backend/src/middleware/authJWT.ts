import { Request, Response, NextFunction } from "express";
import ValidarToken from "../Services/jwtServices";

export const authJWT = (tipoUsuario: number[]) =>{
    return (req:Request, res:Response,next:NextFunction)=>{
    const token = req.cookies.token;
    if (!token) {
           return res.status(401).json({
                success: false,
                message: "Token não fornecido",
            });
            
        }

        const payload = ValidarToken(token);
    
        if(!payload)
            return res.status(401).json({
                success: false,
                message: "Token inválido" });


        if (tipoUsuario && !tipoUsuario.includes(payload.tipo)) {
            return res.status(403).json({
                success:false,
                message: "acesso negado"
            })
        }

    res.locals.payload = payload;
    next();
}
}