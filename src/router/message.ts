import { Router } from "express";
import { body, param, query } from "express-validator";
import requestValidator from "../middleware/requestValidator";
import validateSession from "../middleware/validateSession";
import messageController from "../controller/messageController";


const messageRoutes = Router();

messageRoutes.post(
    '/send',
    body('jid').isString().notEmpty(),
    body('type').isString().isIn(['group', 'number']).optional(),
    body('message').isObject().notEmpty(),
    body('options').isObject().optional(),
    query('sessionId').isString().notEmpty(),
    requestValidator,
    validateSession,
    messageController.send
);

messageRoutes.post(
    '/send/bulk',
    body().isArray().notEmpty(),
    query('sessionId').isString().notEmpty(),
    requestValidator,
    validateSession,
    messageController.sendBulk
)

export default messageRoutes;