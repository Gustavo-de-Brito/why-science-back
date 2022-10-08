import { Answer } from '@prisma/client';
import { answerRepository } from '../repositories/answerRepository';
import { AnswerData } from '../types/answerTypes';

async function createAnswer(answer: AnswerData):Promise<Answer> {
  const answerDb: Answer = await answerRepository.insert(answer);

  return answerDb;
}

async function findQuestionAnswers(questionId: number) {
  const answers = await answerRepository.getAnswersByQuestionId(questionId);

  const formatedAnswers = answers.map(answer => {
    const formatedAnswer = {
      id: answer.id,
      text: answer.text,
      author: answer.users.name,
      imageUrl: answer.users.imageUrl
    }

    return formatedAnswer;
  });

  return formatedAnswers;
}

export const answerService = {
  createAnswer,
  findQuestionAnswers
};