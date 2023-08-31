import { Request, Response } from "express";
import { createSession, deleteSession, getSession, getSessionStatus, listSessions, sessionExist } from "../wa";



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
    },
    list: (req:Request, res:Response) => {
        res.status(200).json(listSessions());
    },
    status: (req:Request, res:Response) => {
        let sessionId:any = req.query.sessionId;
        const session = getSession(sessionId)!;
        res.status(200).json({ status: getSessionStatus(session) });
    },
    delete: async(req:Request, res:Response) => {
        await deleteSession(req.params.sessionId);
        res.status(200).json({ message: 'Session deleted' });
    }
};

export default sessionController;