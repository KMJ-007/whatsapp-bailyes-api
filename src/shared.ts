import pino from 'pino';
import { PrismaClient } from '@prisma/client';


export const prisma = new PrismaClient();
console.log({LOG_LEVEL:process.env.LOG_LEVEL})
export const logger = pino({ level: process.env.LOG_LEVEL || 'debug' });
