import { Router } from 'express';
import sessionRoutes from './sessionRoutes';
import messageRoutes from './messageRoutes';

const router = Router();
router.use('/sessions', sessionRoutes);
router.use('/:sessionId/messages', messageRoutes);

export default router;
