import { Router } from 'express';
import sessionController from '../controller/sessionController';
import { body } from "express-validator";
import requestValidator from '../middleware/requestValidator';

const sessionRouter = Router();

sessionRouter.post('/add', body('sessionId').isString().notEmpty(), requestValidator,sessionController.add)

export default sessionRouter;
