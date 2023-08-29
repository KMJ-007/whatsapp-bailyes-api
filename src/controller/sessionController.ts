import { Request, Response } from "express";
import { createSession } from "../wa";



const sessionController = {
    
    add: async (req:Request, res:Response) => {
            createSession({
                sessionId: req.body.sessionId,
                res,
            });
    }
};

export default sessionController;