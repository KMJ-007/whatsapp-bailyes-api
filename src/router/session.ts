import { Router } from 'express';
import sessionController from '../controller/sessionController';
import { body, query } from "express-validator";
import requestValidator from '../middleware/requestValidator';

const sessionRouter = Router();

sessionRouter.post('/add', body('sessionId').isString().notEmpty(), requestValidator,sessionController.add);
sessionRouter.get('/list', sessionController.list);
sessionRouter.get('/status',query('sessionId').isString().notEmpty(),requestValidator,sessionController.status);
sessionRouter.delete('/delete',query('sessionId').isString().notEmpty(),requestValidator,sessionController.delete)

export default sessionRouter;
