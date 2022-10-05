import { categoryService } from './categoryService';
import { IQuestionRegister, QuestionData } from '../types/questionTypes';
import { Category, Question, User } from '@prisma/client';
import { conflictError, notFoundError, unprocessableError } from '../utils/erroUtils';
import { questionsRepository } from '../repositories/questionsRepository';

async function isCategoryIdValid(categoryId: number) {
  const category: Category | null = await categoryService.findCategoryById(
    categoryId
  );

  if(category === null) throw notFoundError('A categoria indicada não existe');

  return category;
}

async function isCategoryNameRegistered(categoryName: string) {
  const category: Category | null = await categoryService.findCategoryByName(
    categoryName
  );

  if(category !== null) throw conflictError('A categoria indicada já existe');
}

async function createCategory(categoryName: string):Promise<Category> {
  await isCategoryNameRegistered(categoryName);
  const category: Category = await categoryService.addCategory(categoryName);

  return category;
}

async function addQuestion(question: IQuestionRegister, user: User)
  :Promise<Question>
  {
  let category:Category | null = null;

  if(question.categoryId !== undefined) {
    category = await isCategoryIdValid(question.categoryId);
  } else if(question.newCategoryName !== undefined) {
    category = await createCategory(question.newCategoryName);
  }

  if(category === null) {
    throw unprocessableError('Não foi informa um id ou nome de categoria');
  }

  const newQuestion: QuestionData = {
    text: question.text,
    userId: user.id,
    categoryId: category.id
  }

  const registeredQuestion: Question = await questionsRepository.insert(
    newQuestion
  );

  return registeredQuestion;
}

export const questionService = {
  addQuestion
};