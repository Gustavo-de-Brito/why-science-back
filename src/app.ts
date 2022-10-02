import express, { json } from 'express';
import cors from 'cors';
import 'express-async-errors';

import indexRouter from './routers/index';
import handlerErrorsMiddleware from './middlewares/handleErrorMiddleware';

const app = express();

app.use(json());
app.use(cors());

app.use(indexRouter);

app.use(handlerErrorsMiddleware);

export default app;