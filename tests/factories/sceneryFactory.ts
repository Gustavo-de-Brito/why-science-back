import dotenv from 'dotenv';
import { dbUserFactory, userFactory } from './userFactory';
import prisma from '../../src/databases/postgresSql';
import bcrypt from 'bcrypt';
import { registerQuestionFactory } from './questionFactory';
import { dbCategoryFactory } from './categoryFactory';
import { answerFactory } from './answerFactory';
import { faker } from '@faker-js/faker';

dotenv.config();

export async function resetDatabase() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`,
    prisma.$executeRaw`TRUNCATE TABLE categories CASCADE;`,
    prisma.$executeRaw`TRUNCATE TABLE questions CASCADE;`
  ]);
}

export async function registeredUserScenery() {
  const newUser = await userFactory();

  const encryptedPassword = bcrypt
    .hashSync(newUser.password, Number(process.env.BCRYPT_SALT));

  const dbUser = { ...newUser, password: encryptedPassword };

  await prisma.user.create({ data: dbUser });

  return newUser;
}

export async function registeredQuestionScenery() {
  const user = await dbUserFactory();
  const questionText = await registerQuestionFactory();
  const category = await dbCategoryFactory();

  const question = {
    text: questionText.text,
    categoryId: category.id,
    userId: user.id
  };

  const dbQuestion = await prisma.question.create({ data: question });

  return dbQuestion;
}

export async function elevenQuestionsRegisteredScenery() {
  const registeredQuestions = [];

  for(let i = 0; i < 10; i++) {
    const question = await registeredQuestionScenery();
    registeredQuestions.push(question);
  }

  return registeredQuestions;
}

export async function registeredAnswersScenery(questionId: number, userId: number) {
  const qtdAnswers = faker.datatype.number({min: 1, max: 10});
  const answers = [];

  for(let i = 0; i < qtdAnswers; i++) {
    const answer = await answerFactory();
  
    const dbAnswer = await prisma.answer.create(
      {
        data: { text: answer.text, questionId, userId }
      }
    );

    answers.push(dbAnswer);
  }

  return answers;
}