import { Router } from "express"
import { body, query } from "express-validator"
import requestValidator from "../middleware/requestValidator"
import validateSession from "../middleware/validateSession"
import chatController from "../controller/chatController"

const chatRoutes = Router();

chatRoutes.get(
    '/chat',
    query('cursor').isNumeric().optional(), 
    query('limit').isNumeric().optional(),
    query('sessionId').isString().notEmpty(),
    requestValidator,
    chatController.list
)

chatRoutes.get(
    ':jid',
    query('cursor').isNumeric().optional(),
    query('limit').isNumeric().optional(),
    query('sessionId').isString().notEmpty(),
    requestValidator,
    chatController.find
)


export default chatRoutes;