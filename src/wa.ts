import makeWASocket, { AnyMessageContent, AuthenticationCreds, ConnectionState, DisconnectReason, SocketConfig, delay, fetchLatestBaileysVersion, initAuthCreds, makeCacheableSignalKeyStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from '@hapi/boom';
import { Response } from "express";
import { logger, prisma } from "./shared";
import { useSession } from "./store/session";

const retries = new Map<string, number>(); // Map to store the number of retries for each session
const sessions = new Map<string, any>(); // Map to store the socket for each session
const RECONNECT_INTERVAL = Number(process.env.RECONNECT_INTERVAL || 0);
const MAX_RECONNECT_RETRIES = Number(process.env.MAX_RECONNECT_RETRIES || 5);
export const SESSION_CONFIG_ID = 'session-config'

export const init = async () => {
  // find unique SessionId 
  const sessionIds = await prisma.session.findMany({
    select: { sessionId: true },
    distinct: ['sessionId']
  });

  // console.log({sessionIds});

  // restore them
  for(const { sessionId} of sessionIds) {
      createSession({ sessionId });
  }
};

const shouldReconnect =  (sessionId: string) => {
    let attempts = retries.get(sessionId) ?? 0;

    if (attempts < MAX_RECONNECT_RETRIES) {
        attempts += 1;
        retries.set(sessionId, attempts);
        return true;
    }
    return false;
};

export const sessionExist = (sessionId: string) => {
  return sessions.has(sessionId); 
};

export const getSession = (sessionId: string) => {
  return sessions.get(sessionId);
};

// pata lagau ki banda whatsapp par exist karta hai kya ?
export const jidExist = async(session: any, jid: string, type: 'group' | 'number' = 'number') => {
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



type createSessionOptions = {
    sessionId: string;
    res?: Response;
    socketConfig?: SocketConfig;
}

export async function createSession(options:createSessionOptions) {
    const { sessionId, res, socketConfig } = options;
    const { state, saveCreds } = await useSession(sessionId);
    const configID = `${SESSION_CONFIG_ID}-${sessionId}`
    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

    const socketConfigForSocket = {
      version,
      logger,
      printQRInTerminal: true,
      auth: {
        // @ts-ignore
        creds: state.creds,
        /** caching makes the store faster to send/recv messages */
        // @ts-ignore
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      generateHighQualityLinkPreview: true,
    };

    // console.log({socketConfigForSocket})
    const sock = makeWASocket(socketConfigForSocket)
  
    const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
      await sock.presenceSubscribe(jid)
      await delay(500)
  
      await sock.sendPresenceUpdate('composing', jid)
      await delay(2000)
  
      await sock.sendPresenceUpdate('paused', jid)
  
      await sock.sendMessage(jid, msg)
    }
        
    sessions.set(sessionId, { ...sock});
    // the process function lets you process all events that just occurred
    // efficiently in a batch
    sock.ev.process(
      // events is a map for event name => event data
      async(events) => {
        // something about the connection changed
        // maybe it closed, or we received all offline message or connection opened
        if(events['connection.update']) {
          const update = events['connection.update']
          const { connection, lastDisconnect } = update
          if(connection === 'close') {
            // reconnect if not logged out
            if((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
              createSession(options)
            } else {
              console.log('Connection closed. You are logged out.')
            }
          }

          console.log('connection update', update)
        }

        // credentials updated -- save them
        if(events['creds.update']) {
          await saveCreds()
        }
        // sample reply msg to see if it is working or not
        // if(events['messages.upsert']) {
        //   const upsert = events['messages.upsert']
        //   console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
  
        //   if(upsert.type === 'notify') {
        //     for(const msg of upsert.messages) {
        //         console.log('replying to', msg.key.remoteJid)
        //         await sock!.readMessages([msg.key])
        //         await sendMessageWTyping({ text: 'Hello there!' }, msg.key.remoteJid!)
        //     }
        //   }
        // }
        
      })
      
  return sock;
}