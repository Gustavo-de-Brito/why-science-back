import { Router } from 'express';
import { createQuestion, getAllQuestions } from '../controllers/questionsController';
import schemaValidation from '../middlewares/schemaValidationMiddeware';
import questionsSchema from '../schemas/questionsSchema';
import tokenValidation from '../middlewares/tokenValidation';

const questionsRouter:Router = Router();

questionsRouter.post(
  '/questions',
  tokenValidation,
  schemaValidation(questionsSchema),
  createQuestion
);

questionsRouter.get(
  '/questions',
  tokenValidation,
  getAllQuestions
)

export default questionsRouter;