import { NextFunction, Request, Response } from "express";
import ValidarToken from "../Services/jwtServices";

export const authMiddleware = (perfis: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // O JWT é lido do cookie HttpOnly, reduzindo a exposição ao JavaScript da página.
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token não fornecido"
            });
            
        }

        // A assinatura e o conteúdo do token são conferidos antes de liberar a rota.
        const payload = ValidarToken(token);

        if (!payload){
            return res.status(401).json({
                success: false,
                message: "Token inválido"
            });
        }
        if (perfis.length > 0 && payload && !perfis.includes(payload.tipo)) {
            // Quando há perfis informados, somente eles podem continuar.
            return res.status(403).json({
                success: false,
                message: "Acesso não autorizado"
            });
        }

        // res.locals transporta a identidade validada para os controllers.
        res.locals.payload = payload;
        next();
    };
};