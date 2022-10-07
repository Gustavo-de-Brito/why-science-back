import { Request, Response } from 'express';
import { Question, User } from '@prisma/client';
import { questionService } from '../services/questionService';
import { IQuestionRegister } from '../types/questionTypes';

export async function createQuestion(req: Request, res: Response) {
  const question: IQuestionRegister = req.body;
  const userData: User = res.locals.userData;

  const registeredQuestion: Question = await questionService.addQuestion(
    question, userData
  );

  res.status(201).send(registeredQuestion);
}

export async function getAllQuestions(req: Request, res: Response) {
  res.sendStatus(503);
}