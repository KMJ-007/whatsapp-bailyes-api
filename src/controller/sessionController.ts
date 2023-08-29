import { Request, Response } from "express";
import { createSession, sessionExist } from "../wa";



const sessionController = {
    
    add: async (req:Request, res:Response) => {
            // if session exist return 
            if(sessionExist(req.body.sessionId)){
                return res.status(200).json({ error: 'Session already exist!' });
            }else{
                createSession({
                    sessionId: req.body.sessionId,
                    res,
                });
            }
    }
};

export default sessionController;