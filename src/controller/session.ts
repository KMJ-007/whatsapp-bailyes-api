import { RequestHandler } from "express";
import { createSession, deleteSession, getSession, getSessionStatus, listSessions, sessionExist } from "../whatsapp/sessionFunctions";



export const list:RequestHandler = (req, res) => {
    res.status(200).json(listSessions());
};

export const find:RequestHandler = (req, res) => {
    // if session don't exist then our session validator will return the response
    res.status(200).json({ message: 'Session found'})
};

export const status:RequestHandler = (req, res) => {
    // this ! at the end, is to tell the typescript compiler that value of the variable will not be null or undefined 
    const session = getSession(req.params.sessionId)!;
    res.status(200).json({ status: getSessionStatus(session) });
};

export const add:RequestHandler = (req, res) => {
    const { sessionId, ...socketConfig } = req.body;
    if(sessionExist(sessionId)) return res.status(400).json({ error: "Session already exist" });
    createSession({ sessionId, res, socketConfig})
};

export const del:RequestHandler = async(req, res) => {
    await deleteSession(req.params.sessionId);
    res.status(200).json({ message: 'Session deleted' });

};

// jinda rakho sale ko
export const addSSE:RequestHandler = async (req, res) => {
    const { sessionId } = req.params;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
  
    if (sessionExist(sessionId)) {
      res.write(`data: ${JSON.stringify({ error: 'Session already exists' })}\n\n`);
      res.end();
      return;
    }
    createSession({ sessionId, res, SSE: true });
};
