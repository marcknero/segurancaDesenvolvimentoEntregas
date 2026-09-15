import { Request, Response, NextFunction } from "express";

export const verifyToken = (req:Request, res:Response,next:NextFunction)=>{
    let csrfToken = req.cookies.csrfToken;
    let csrfTokenHeader = req.headers["X-CSRF-Token"] as string| undefined;
    if (!csrfToken || !csrfTokenHeader || csrfToken !== csrfTokenHeader) {
        return res.status(403).json({
            success: false,
            message: "Token CSRF inválido"
        });
    }

    next();

}