import prisma from '../databases/postgresSql';
import { Question } from '@prisma/client';
import { QuestionData } from '../types/questionTypes';

async function getQuestionByText(questionText: string)
  :Promise<Question | null>
{
  const question: Question | null = await prisma.question.findUnique(
    {
      where: { text: questionText }
    }
  );

  return question;
}

async function insert(question: QuestionData):Promise<Question> {
  const newQuestion: Question = await prisma.question.create({ data: question });

  return newQuestion;
}

export const questionsRepository = {
  getQuestionByText,
  insert
};