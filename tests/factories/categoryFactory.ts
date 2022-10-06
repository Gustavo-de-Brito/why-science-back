import { faker } from '@faker-js/faker';
import { Category } from '@prisma/client';

export async function categoryFactory(): Promise<Category> {
  return {
    id: faker.datatype.number(),
    name: faker.lorem.word()
  };
}