import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { init } from './whatsapp/whatsapp';
import router from './routes/router';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/',router);
app.all('*',(req,res) => res.status(400).json({error: 'Wrong Url'}));

const host = process.env.HOST || 'localhost';
const port = Number(process.env.port || 3000);
const listener = () => console.log(`Server is listening on http://${host}:${port}`);

(async ()=>{
    await init();
    app.listen(port, host, listener);
})();