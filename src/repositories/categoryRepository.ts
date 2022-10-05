import { Category } from '@prisma/client';
import prisma from '../databases/postgresSql';

async function getCategoryById(categoryId: number):Promise<Category | null> {
  const category: Category | null = await prisma.category.findUnique(
    {
      where: { id: categoryId }
    }
  );

  return category;
}

async function getCategoryByName(categoryName: string)
  :Promise<Category | null>
{
  const category: Category | null = await prisma.category.findUnique(
    {
      where: { name: categoryName }
    }
  );

  return category;
}

async function insert(categoryName: string):Promise<Category> {
  const category: Category = await prisma.category.create(
    {
      data: { name: categoryName }
    }
  );

  return category;
}

export const categoryRepository = {
  getCategoryById,
  getCategoryByName,
  insert
};