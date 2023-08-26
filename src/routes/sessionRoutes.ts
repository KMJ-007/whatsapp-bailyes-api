import { Router } from "express";
import * as controller from "../controller/session"
import validateSession from "../middleware/sessionValidator";
import { body } from "express-validator";
import requestValidator from "../middleware/RequestValidator";

const sessionRoutes = Router();

sessionRoutes.get('/',controller.list);
sessionRoutes.get('/:sessionId', validateSession, controller.find);
sessionRoutes.get('/:sessionId/status', validateSession, controller.status);
sessionRoutes.post('/add', body('sessionId').isString().notEmpty(), requestValidator, controller.add);
sessionRoutes.get('/:sessionId/add-sse', controller.addSSE);
sessionRoutes.delete('/:sessionId', validateSession, controller.del)

export default sessionRoutes;