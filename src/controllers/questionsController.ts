import { Request, Response } from 'express';
import { Answer, Question, User } from '@prisma/client';
import { questionService } from '../services/questionService';
import { IQuestionRegister } from '../types/questionTypes';
import { IRegisterAnswer } from '../types/answerTypes';

export async function createQuestion(req: Request, res: Response) {
  const question: IQuestionRegister = req.body;
  const userData: User = res.locals.userData;

  const registeredQuestion: Question = await questionService.addQuestion(
    question, userData
  );

  res.status(201).send(registeredQuestion);
}

export async function getAllQuestions(req: Request, res: Response) {
  const questions = await questionService.findQuestions();

  res.status(200).send(questions);
}

export async function toggleQuestionLike(req: Request, res: Response) {
  const userData:User = res.locals.userData;
  const questionId: number = parseInt(req.params.id);

  await questionService.toggleQuestionLike(questionId, userData.id);

  res.sendStatus(200);
}

export async function addAnswer(req: Request, res: Response) {
  const answer:IRegisterAnswer = req.body;
  const userData:User = res.locals.userData;
  const questionId: number = parseInt(req.params.id);

  const answerDb:Answer = await questionService.registerAnswer(answer, questionId, userData.id);

  res.status(201).send(answerDb);
}

export async function getAnswers(req: Request, res: Response) {
  res.sendStatus(503);
}