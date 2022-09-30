import express, { json } from 'express';
import cors from 'cors';

const app = express();

app.use(json());
app.use(cors());

app.get('/', (req, res) => res.status(200).send('servidor no ar'));

export default app;