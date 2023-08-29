import express from 'express';
import bodyParser from 'body-parser';
import sessionRouter from './router/session';
import { logger, prisma } from './shared';
import messageRoutes from './router/message';
import { init } from './wa';


const app = express();

app.use(bodyParser.json());

app.use('/session',sessionRouter);
app.use('/messages',messageRoutes);
app.all('*',(req,res) => res.status(400).json({error: 'Wrong Url'}));

(async ()=>{
  await init();
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
})();
