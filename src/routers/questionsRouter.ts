import { Router } from 'express';
import schemaValidation from '../middlewares/schemaValidationMiddeware';
import questionsSchema from '../schemas/questionsSchema';
import { createQuestion } from '../controllers/questionsController';

const questionsRouter:Router = Router();

questionsRouter.post(
  '/questions',
  schemaValidation(questionsSchema),
  createQuestion
);

export default questionsRouter;