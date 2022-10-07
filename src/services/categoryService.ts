import { Category } from '@prisma/client';
import { categoryRepository } from '../repositories/categoryRepository';

async function findCategoryById(categoryId: number):Promise<Category | null> {
  const category: Category | null = await categoryRepository.getCategoryById(
    categoryId
  );

  return category;
}

async function findCategoryByName(categoryName: string):Promise<Category | null> {
  const category: Category | null = await categoryRepository.getCategoryByName(
    categoryName
  );

  return category;
}

async function addCategory(categoryName: string):Promise<Category> {
  const category: Category = await categoryRepository.insert(
    categoryName
  );

  return category;
}

export const categoryService = {
  findCategoryById,
  findCategoryByName,
  addCategory
};