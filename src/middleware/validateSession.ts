import { RequestHandler } from "express";
import { sessionExist } from "../wa";


const validateSession:RequestHandler = (req,res,next)=>{
    // console.log("hello")
    // console.log(req.query);
    // @ts-ignore
    if(!sessionExist(req.query.sessionId)){
        return res.status(404).json({ error: 'Session not found' });
    }
    next();
};

export default validateSession;