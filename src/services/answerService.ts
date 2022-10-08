import { Answer } from '@prisma/client';
import { answerRepository } from '../repositories/answerRepository';
import { AnswerData } from '../types/answerTypes';

async function createAnswer(answer: AnswerData):Promise<Answer> {
  const answerDb: Answer = await answerRepository.insert(answer);

  return answerDb;
}

export const answerService = {
  createAnswer
};