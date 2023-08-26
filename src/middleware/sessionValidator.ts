import { RequestHandler } from "express";
import { sessionExist } from "../whatsapp/sessionFunctions";


const validateSession:RequestHandler = (req,res,next)=>{
    if(!sessionExist(req.params.sessionId)){
        return res.status(404).json({ error: 'Session not found' });
    }
    next();
};

export default validateSession;