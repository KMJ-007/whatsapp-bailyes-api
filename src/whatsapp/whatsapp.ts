import { Store, initStore } from "@ookamiiixd/baileys-store";
import { WASocket } from "@whiskeysockets/baileys";
import {prisma, logger} from '../common'
import { createSession } from "./sessionFunctions";

export type WhatsappSession = WASocket & {
    destroy: () => Promise<void>;
    store: Store;
};

export const whatsappSessions = new Map<string,WhatsappSession>();
export const retries = new Map<string,number>();
export const SSEQRGenerations = new Map<string, number>();

export const RECONNECT_INTERVAL = Number(process.env.RECONNECT_INTERVAL || 0);
export const MAX_RECONNECT_RETRIES = Number(process.env.MAX_RECONNECT_RETRIES || 5);
export const SSE_MAX_QR_GENERATION = Number(process.env.SSE_MAX_QR_GENERATION || 5);

export const SESSION_CONFIG_ID = 'session-config';

export const init = async () => {
    // init the store
    initStore({prisma, logger})
    
    // find the existing session from the database
    const sessions = await prisma.session.findMany({
        select: { sessionId:true, data:true },
        where: { id: { startsWith: SESSION_CONFIG_ID}}
    });

    // restore them
    for(const { sessionId, data} of sessions) {
        console.log({data});
        const {...socketConfig } = JSON.parse(data);
        createSession({ sessionId, socketConfig });
    }
}