import pino from 'pino';
import { PrismaClient } from '@prisma/client';


export const prisma = new PrismaClient();
export const logger = pino({ level: process.env.LOG_LEVEL || 'debug' });
