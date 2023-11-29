import express from 'express';
import bodyParser from 'body-parser';
import sessionRouter from './router/session';
import { logger, prisma } from './shared';
import messageRoutes from './router/message';
import { init } from './wa';
import { authMiddleware } from './middleware/auth-middleware';
import cors from 'cors';



const app = express();

var corsOptions : any = process.env.CORSOPTIONS ||
{
  origin:  '*',
   methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],    
   allowedHeaders: [ 'Content-Type', 'authorization' ],
   credentials: true
 };

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(authMiddleware)
app.use('/session',sessionRouter);
app.use('/messages',messageRoutes);
app.all('*',(req,res) => res.status(400).json({error: 'Wrong Url'}));

(async ()=>{
  await init();
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
})();
