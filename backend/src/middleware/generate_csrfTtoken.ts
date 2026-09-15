import { Request, Response, NextFunction } from "express";
import crypto,{ randomBytes } from "crypto";
import strict from "assert/strict";

export const generateCSRFToken = (req:Request, res:Response,next:NextFunction)=>{
    let csrfToken = req.cookies.csrfToken;
    if(!csrfToken){
        csrfToken = randomBytes(32).toString('hex');
        res.cookie('csrfToken', csrfToken, {
            httpOnly:true,
            // secure:true,
            sameSite:'strict'
        });
    }    
    res.locals.csrfToken = csrfToken;
    next();
}