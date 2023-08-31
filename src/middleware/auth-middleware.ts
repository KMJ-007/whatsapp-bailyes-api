import { NextFunction, Request, Response } from "express";


export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    // if auth header is not there then return it or check with the env secret
    if (!req.headers.auth_token || req.headers.auth_token!==process.env.AUTH_TOKEN) {
        return res.status(403).json({ error: 'Please Provide Valid Auth Token!' });
    }
    next();
}