import { Router } from 'express';
import {
  addAnswer,
  createQuestion,
  getAllQuestions,
  toggleQuestionLike
} from '../controllers/questionsController';
import schemaValidation from '../middlewares/schemaValidationMiddeware';
import questionsSchema from '../schemas/questionsSchema';
import tokenValidation from '../middlewares/tokenValidation';
import paramsIdValidation from '../middlewares/paramsIdValidation';

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
);

questionsRouter.post(
  '/questions/:id/likes',
  paramsIdValidation,
  tokenValidation,
  toggleQuestionLike
);

questionsRouter.post(
  '/questions/:id/answers',
  paramsIdValidation,
  tokenValidation,
  addAnswer
);

export default questionsRouter;