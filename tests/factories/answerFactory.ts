import { faker } from '@faker-js/faker';

export async function answerFactory() {
  return {
    text: faker.lorem.sentence()
  };
}

export async function answersArrayFactory() {
  const answers = [];

  for(let i = 1; i <= 10; i++) {
    const answer = {
      id: i,
      text: faker.lorem.sentence(),
      users: {
        name: faker.name.fullName(),
        imageUrl: faker.image.cats()
      }
    };

    answers.push(answer);
  }

  return answers;
}