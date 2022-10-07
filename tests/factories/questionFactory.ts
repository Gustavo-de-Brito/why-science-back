import { faker } from '@faker-js/faker';
import { IQuestionRegister } from "../../src/types/questionTypes";

export async function registerQuestionFactory(): Promise<IQuestionRegister> {
  return {
    text: `${faker.lorem.sentence()}?`
  };
}