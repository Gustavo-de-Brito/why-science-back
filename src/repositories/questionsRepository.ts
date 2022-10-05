import prisma from '../databases/postgresSql';
import { Question } from '@prisma/client';
import { QuestionData } from '../types/questionTypes';

async function insert(question: QuestionData):Promise<Question> {
  const newQuestion: Question = await prisma.question.create({ data: question });

  return newQuestion;
}

export const questionsRepository = {
  insert
};