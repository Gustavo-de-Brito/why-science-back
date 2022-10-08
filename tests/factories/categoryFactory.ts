import { faker } from '@faker-js/faker';
import { Category } from '@prisma/client';
import prisma from '../../src/databases/postgresSql';

export async function categoryFactory(): Promise<Category> {
  return {
    id: faker.datatype.number(),
    name: faker.lorem.word()
  };
}

export async function dbCategoryFactory() {
  const categoryName = faker.lorem.words(3);

  const category = await prisma.category.create(
    {
      data: { name: categoryName }
    }
  );

  return category;
}