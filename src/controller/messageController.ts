import { Request, Response, application } from "express";
import { getSession, jidExist } from "../wa";
import { logger } from "../shared";
import { proto } from "@whiskeysockets/baileys";
import { delay as delayMS } from "@whiskeysockets/baileys";

const messageController = {
    send: async (req:Request, res:Response, ) => {
        try {
            const { jid, type = 'number', message, options } = req.body;
            const newMsg = { text : `Following msg was sent to the ${jid.slice(2,12)} \n ${message.text}` } 
            // @ts-ignore
            const session = getSession(req.query.sessionId);
            const exists = await jidExist(session, jid, type);
            if (!exists) return res.status(400).json({ error: 'JID does not exists' });
            console.log('sending message') 
            // console.log();
            const result = await session.sendMessage(jid, message, options);
            const msgSelf = await session.sendMessage(session.user.id, newMsg, options)
            res.status(200).json({result, msgSelf}); 
    
        } catch (error) {
            const message = 'An error occured during message send';
            logger.error(error, message);
            res.status(500).json({ error: error });   
        }
    },
    sendBulk: async(req:Request, res:Response) => {
        let sessionId:any = req.query.sessionId;
        const session = getSession(sessionId)!;
        const results: { index: number; result: proto.WebMessageInfo | undefined }[] = [];
        const selfMsgResults : { index: number; selfMsgresult: proto.WebMessageInfo | undefined }[] = [];
        const errors: { index: number; error: string }[] = [];
        for (const [
          index,
          { jid, type = 'number', delay = 1000, message, options },
        ] of req.body.entries()) {
          try {
            const exists = await jidExist(session, jid, type);
            if (!exists) {
              errors.push({ index, error: 'JID does not exists' });
              continue;
            }
      
            if (index > 0) await delayMS(delay);
            const newMsg = { text : `  \n   Following msg was sent to the ${jid.slice(2,12)}   \n  \n  ${message.text}` } 
            const result = await session.sendMessage(jid, message, options);
            const selfMsgresult = await session.sendMessage(session.user.id, newMsg, options);
            results.push({ index, result });
            selfMsgResults.push({ index, selfMsgresult  });
          } catch (e) {
            const message = 'An error occured during message send';
            logger.error(e, message);
            errors.push({ index, error: message });
          }
        }
      
        res
          .status(req.body.length !== 0 && errors.length === req.body.length ? 500 : 200)
          .json({ results, selfMsgResults, errors });
    },
}

export default messageController;