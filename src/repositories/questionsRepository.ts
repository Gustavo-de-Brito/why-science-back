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

async function getQuestions() {
  const questions = await prisma.question.findMany(
    {
      select: {
        id: true,
        text: true,
        categories: {
          select: {
            name: true
          }
        },
        users: {
          select: {
            name: true,
            imageUrl: true
          }
        }
      },
      orderBy: { id: 'desc' },
      take: 10
    }
  );

  return questions;
}

async function getQuestionById(questionId: number):Promise<Question | null> {
  const question:Question | null = await prisma.question.findUnique(
    {
      where: { id: questionId }
    }
  );

  return question;
}

async function getQuestionCategoryAuthorById(questionId: number) {
  const question = await prisma.question.findUnique(
    {
      where: { id: questionId },
      select: {
        id: true,
        text: true,
        categories: {
          select: {
            name: true
          }
        },
        users: {
          select: {
            name: true,
            imageUrl: true
          }
        }
      }
    }
  );

  return question;
}

export const questionsRepository = {
  getQuestionByText,
  insert,
  getQuestions,
  getQuestionById,
  getQuestionCategoryAuthorById
};