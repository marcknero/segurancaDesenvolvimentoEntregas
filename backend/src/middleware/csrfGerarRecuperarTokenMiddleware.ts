import { NextFunction, Request, Response } from "express";
import crypto, { randomBytes } from "crypto";

export const csrfGerarTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Reutiliza o token CSRF existente ou cria um valor aleatório para a sessão.
    let csrfToken = req.cookies.csrfToken;
    if (!csrfToken) {
        csrfToken = randomBytes(32).toString("hex");
        res.cookie("csrfToken", csrfToken, {
            // O cookie é usado junto com o header para dificultar requisições forjadas.
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
    }


    // Disponibiliza o token para os controllers devolverem ao frontend.
    res.locals.csrfToken = csrfToken;

    next();
};