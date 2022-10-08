import { faker } from '@faker-js/faker';

export async function answerFactory() {
  return {
    text: faker.lorem.sentence()
  };
}