import { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

import authRouter from './authRouter';
import e2eRouter from './e2eRouter';

const indexRouter: Router = Router();

indexRouter.use(authRouter);

if(process.env.NODE_ENV === 'TEST') {
  indexRouter.use(e2eRouter);
}

export default indexRouter;