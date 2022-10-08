import { Answer } from '@prisma/client';
import prisma from '../databases/postgresSql';
import { AnswerData } from '../types/answerTypes';

async function insert(answer: AnswerData):Promise<Answer> {
  const answerDb:Answer = await prisma.answer.create({ data: answer });

  return answerDb
}

async function getAnswersByQuestionId(questionId: number) {
  const answers = prisma.answer.findMany(
    {
      where: { questionId },
      select: {
        id: true,
        text: true,
        users: {
          select: {
            name: true,
            imageUrl: true
          }
        }
      }
    }
  );

  return answers;
}

export const answerRepository = {
  insert,
  getAnswersByQuestionId
};