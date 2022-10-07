import { faker } from '@faker-js/faker';
import { IQuestionRegister } from "../../src/types/questionTypes";

export async function registerQuestionFactory(): Promise<IQuestionRegister> {
  return {
    text: `${faker.lorem.sentence()}?`
  };
}

export async function questionsDbGetFactory() {
  const questions = [];

  for(let i = 1; i <= 10; i++) {
    const question = {
      id: i,
      text: `${faker.lorem.sentence()}?`,
      categories: {
        name: faker.lorem.word()
      },
      users: {
        name: faker.name.fullName()
      }
    };

    questions.push(question);
  }

  return questions;
}