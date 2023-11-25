import { serializePrisma } from '../store/utils';
import type { Request, Response } from 'express';
import { logger, prisma } from '../shared';

const chatController = { 
    list:  async (req: Request, res : Response) => {
        try {
            // console.log(req.query)
            const sessionId:any  = req.query.sessionId;
            // console.log("sessionId = " + sessionId);
            const { cursor = undefined, limit = 25 } = req.query;
            // console.log("cursor : "+ cursor+ " limit = " + limit)
            const chats = (
            await prisma.chat.findMany({
                cursor: cursor ? { pkId: Number(cursor) } : undefined,
                take: Number(limit),
                skip: cursor ? 1 : 0,
                where: { sessionId },
            })
            ).map((c : any) => serializePrisma(c));

            // console.log(chats);

            res.status(200).json({
            data: chats,
            cursor:
                chats.length !== 0 && chats.length === Number(limit) ? chats[chats.length - 1].pkId : null,
            });
        } catch (e) {
            const message = 'An error occured during chat list';
            logger.error(e, message);
            res.status(500).json({ error: message });
        }
    },
    find:  async (req :Request, res : Response ) => {
        try {
            const { sessionId, jid } = req.params;
            const { cursor = undefined, limit = 25 } = req.query;
            const messages = (
            await prisma.message.findMany({
                cursor: cursor ? { pkId: Number(cursor) } : undefined,
                take: Number(limit),
                skip: cursor ? 1 : 0,
                where: { sessionId, remoteJid: jid },
                orderBy: { messageTimestamp: 'desc' },
            })
            ).map((m : any) => serializePrisma(m));

            res.status(200).json({
            data: messages,
            cursor:
                messages.length !== 0 && messages.length === Number(limit)
                ? messages[messages.length - 1].pkId
                : null,
            });
        } catch (e) {
            const message = 'An error occured during chat find';
            logger.error(e, message);
            res.status(500).json({ error: message });
        }
    },
}

export default chatController;