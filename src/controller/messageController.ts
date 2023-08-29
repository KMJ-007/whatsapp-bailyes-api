import { Request, Response } from "express";
import { getSession, jidExist } from "../wa";
import { logger } from "../shared";

const messageController = {
    send: async (req:Request, res:Response) => {
        // try {
            const { jid, type = 'number', message, options } = req.body;
            // @ts-ignore
            const session = getSession(req.query.sessionId);
            // console.log(session)
            const exists = await jidExist(session, jid, type);
            if (!exists) return res.status(400).json({ error: 'JID does not exists' });
    
            const result = await session.sendMessage(jid, message, options);
            res.status(200).json(result);
    
        // } catch (error) {
        //     const message = 'An error occured during message send';
        //     logger.error(error, message);
        //     res.status(500).json({ error: error });   
        // }
    }
}

export default messageController;