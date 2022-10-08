import { Answer } from '@prisma/client';
import prisma from '../databases/postgresSql';
import { AnswerData } from '../types/answerTypes';

async function insert(answer: AnswerData):Promise<Answer> {
  const answerDb:Answer = await prisma.answer.create({ data: answer });

  return answerDb
}

export const answerRepository = {
  insert
};