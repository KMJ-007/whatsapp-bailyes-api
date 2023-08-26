import makeWASocket, { Browsers, ConnectionState, DisconnectReason, SocketConfig, isJidBroadcast, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys"
import { RequestHandler, Response } from "express"
import { MAX_RECONNECT_RETRIES, SESSION_CONFIG_ID, SSEQRGenerations, SSE_MAX_QR_GENERATION, WhatsappSession, retries, whatsappSessions } from "./whatsapp";
import { logger, prisma } from "../common";
import { Store, useSession } from "@ookamiiixd/baileys-store";
import { toDataURL } from "qrcode";


type createSessionOption = {
    sessionId: string,
    res?: Response,
    // server sent event
    SSE?: boolean,
    socketConfig?: SocketConfig
};

const shouldReconnect = (sessionId: string) => {
    let attempts = retries.get(sessionId) ?? 0;

    if(attempts < MAX_RECONNECT_RETRIES){
        attempts += 1;
        retries.set(sessionId, attempts);
        return true;
    }
    return false;
}

export const createSession = async(options:createSessionOption) => {
    const { sessionId, res, SSE = false, socketConfig } = options;
    const configID = `${SESSION_CONFIG_ID}-${sessionId}`;
    // intial state will be closed
    let connectionState: Partial<ConnectionState> = { connection: 'close' }
    // session ko destory karo database aur local Map dono mai se
    const destroy = async (logout = true) => {
        try {
            await Promise.all([
                logout && socket.logout(),
                prisma.session.deleteMany({where:{ sessionId}})
            ])
        } catch (error) {
            logger.error(error, 'An error occured during session destroy')
        } finally {
            whatsappSessions.delete(sessionId)
        }
    }

    const handleConnectionClose = () => {
        // @ts-ignore
        const code = (connectionState.lastDisconnect?.error)?.output?.statusCode; 
        const restartRequired = code === DisconnectReason.restartRequired;
        const doNotReconnect = !shouldReconnect(sessionId);
    };

    const handleSSEConnectionUpdate = async() => {
        let qr: string | undefined = undefined;

        if(connectionState.qr?.length){
            try {
               qr = await toDataURL(connectionState.qr);
            } catch (e) {
                logger.error(e, 'Error during QR generation SSE');
            }
        }
        
        const currentGenerations = SSEQRGenerations.get(sessionId) ?? 0;
        // agar qr hai aur uski max generate ho gaya hai to session ko destroy  karo
        // aur agar koi req hai to uska res end karo q ki connection update ho gaya hai
        if(!res || res.writableEnded || (qr && currentGenerations >= SSE_MAX_QR_GENERATION)){
            res && !res.writableEnded && res.end();
            destroy();
            return;
        }
        
        // send the data back to the res
        const data = { ...connectionState, qr };
        // update the server side generated 
        if(qr) SSEQRGenerations.set(sessionId, currentGenerations + 1);
        res.write(`data: ${JSON.stringify(data)}`)
    };

    const handleNormalConnectionUpdate = async() => {
        // agar normal connection hai aur wo update hua hai to res mai qr bhejdo 
        if(connectionState.qr?.length){
            if(res && !res.headersSent){
                try {
                   const qr = await toDataURL(connectionState.qr);
                   res.status(200).json({qr});
                   return; 
                } catch (e) {
                    logger.error(e, 'Error occured during normal QR generation');
                }
            }
        }
    };

    const handleConnectionUpdate = SSE ? handleSSEConnectionUpdate : handleNormalConnectionUpdate;
    
    const { state, saveCreds } = await useSession(sessionId);
    /* 
            _____            _        _   
            /  ___|          | |      | |  
            \ `--.  ___   ___| | _____| |_ 
            `--. \/ _ \ / __| |/ / _ \ __|
            /\__/ / (_) | (__|   <  __/ |_ 
            \____/ \___/ \___|_|\_\___|\__|
     */
    const socket = makeWASocket({
        printQRInTerminal: false,
        browser: Browsers.appropriate('Chrome'),
        generateHighQualityLinkPreview: false,
        ...socketConfig,
        auth: {
            creds: state.creds,
            // there is something called SignalKeyStore, ye function usko cache karta hai aur agar kuch error ya info ho to usko log karta hai 
            // https://www.youtube.com/watch?v=DXv1boalsDI
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        logger,
        // ignore if id brodcast
        shouldIgnoreJid: (jid) => isJidBroadcast(jid),
    })
    console.log({socket}); 
    // creating new store
    const store = new Store(sessionId, socket.ev);
    
    // saving store for the user's session;
    whatsappSessions.set(sessionId, { ...socket, destroy, store})
    
    //save the creds when they are updated
    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
        connectionState = update;
        const { connection } = update;

        if(connection === 'open'){
            // connection agar fir se open hua hai to retries aur qr code counter ko reset karo 
            retries.delete(sessionId);
            SSEQRGenerations.delete(sessionId);
        }
        if(connection === "close") handleConnectionClose();

        handleConnectionUpdate();
    })

    // session create hogaya uske baad db mai bhi usko update kardo

    await prisma.session.upsert({
        create:{
            id: configID,
            sessionId,
            data: JSON.stringify({...socketConfig}),
        },
        update:{},
        where: { sessionId_id: {id: configID, sessionId}}
    })
};

export const sessionExist = (sessionId: string) => {
    return whatsappSessions.has(sessionId);
};

export const getSessionStatus = (session: WhatsappSession) => {
    const state = ['CONNECTING', 'CONNECTED', 'DISCONNECTING', 'DISCONNECTED'];
    let status = state[(session.ws as any).readyState];
    status = session.user ? 'AUTHENTICATED' : status;
    return status;
};

export const listSessions = () => {
    return Array.from(whatsappSessions.entries()).map(([id,session])=>({
        id,
        status: getSessionStatus(session)
    }))
};

export const getSession = (sessionId: string) => {
    return whatsappSessions.get(sessionId);
};

export const deleteSession = async(sessionId: string) => {
    whatsappSessions.get(sessionId)?.destroy();
};

// pata lagau ki banda whatsapp par exist karta hai kya ?
export const jidExist = async(session: WhatsappSession, jid: string, type: 'group' | 'number' = 'number') => {
    try {
        if (type === 'number') {
            const [result] = await session.onWhatsApp(jid);
            return !!result?.exists;
          }
      
          const groupMeta = await session.groupMetadata(jid);
          return !!groupMeta.id; 
    } catch (error) {
        return Promise.reject(error);
    }
}

