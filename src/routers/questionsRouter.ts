import { Router } from 'express';
import schemaValidation from '../middlewares/schemaValidationMiddeware';
import questionsSchema from '../schemas/questionsSchema';
import { createQuestion } from '../controllers/questionsController';
import tokenValidation from '../middlewares/tokenValidation';

const questionsRouter:Router = Router();

questionsRouter.post(
  '/questions',
  tokenValidation,
  schemaValidation(questionsSchema),
  createQuestion
);

export default questionsRouter;