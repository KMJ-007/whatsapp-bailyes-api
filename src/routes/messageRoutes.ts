import { Router } from "express";
import { body } from "express-validator";
import requestValidator from "../middleware/RequestValidator";
import validateSession from "../middleware/sessionValidator";
import * as controller from "../controller/message";

const messageRoutes = Router();

messageRoutes.post(
    '/send',
    body('jid').isString().notEmpty(),
    body('type').isString().isIn(['group', 'number']).optional(),
    body('message').isObject().notEmpty(),
    body('options').isObject().optional(),
    requestValidator,
    validateSession,
    controller.send
);

messageRoutes.post(
    '/send/bulk',
    body().isArray().notEmpty(),
    requestValidator,
    validateSession,
    controller.sendBulk
);

messageRoutes.post(
    '/download',
    body().isObject().notEmpty(),
    requestValidator,
    validateSession,
    controller.download
  );

export default messageRoutes;