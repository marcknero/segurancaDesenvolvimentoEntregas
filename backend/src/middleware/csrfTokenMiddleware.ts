import { NextFunction, Request, Response } from "express";

export const csrfTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // A proteção Double Submit compara o token guardado no cookie com o header.
    // A requisição só continua quando os dois valores são iguais.
    const tokenCookie = req.cookies.csrfToken;
    const tokenHeader = req.headers['x-csrf-token'] as string;
    if (!tokenCookie || !tokenHeader || tokenCookie !== tokenHeader) {
        return res.status(403).json({
            success: false,
            message: "Token CSRF inválido"
        });
    }

    next();
};