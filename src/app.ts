import express, { json } from 'express';
import cors from 'cors';
import 'express-async-errors';

import handlerErrorsMiddleware from './middlewares/handleErrorMiddleware';

const app = express();

app.use(json());
app.use(cors());

app.get('/', (req, res) => res.status(200).send('servidor no ar'));

app.use(handlerErrorsMiddleware);

export default app;