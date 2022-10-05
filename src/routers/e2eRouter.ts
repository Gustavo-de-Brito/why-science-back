import { Router } from 'express';
import { e2eController } from '../controllers/e2eController';

const e2eRouter = Router();

e2eRouter.post('/reset-db', e2eController.resetDatabase);

export default e2eRouter;