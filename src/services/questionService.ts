import { categoryService } from './categoryService';
import { IQuestionRegister, QuestionData } from '../types/questionTypes';
import { Category, Like, Question, User } from '@prisma/client';
import { conflictError, notFoundError, unprocessableError } from '../utils/erroUtils';
import { questionsRepository } from '../repositories/questionsRepository';
import { likeService } from './likeService';
import { IRegisterAnswer } from '../types/answerTypes';

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

async function isQuestionRegistered(questionText: string) {
  const question: Question | null = await questionsRepository.getQuestionByText(
    questionText
  );

  if(question !== null) throw conflictError('Essa pergunta já existe');
}

async function addQuestion(question: IQuestionRegister, user: User)
  :Promise<Question>
{
  await isQuestionRegistered(question.text);

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

function formatQuestion(question: any) {
  const formatedQuestion = {
    id: question.id,
    text: question.text,
    category: question.categories.name,
    author: question.users.name
  }

  return formatedQuestion;
}

async function findQuestions() {
  const questions = await questionsRepository.getQuestions();

  const formatedQuestions = questions.map(formatQuestion);

  return formatedQuestions;
}

async function isQuestionIdValid(questionId: number) {
  const question:Question | null = await questionsRepository.getQuestionById(
    questionId
  );

  if(question === null) throw notFoundError('O id da questão não existe');
}

async function isQuestionLiked(questionId: number, userId: number)
  : Promise<Like | null>
{
  const like:Like | null = await likeService.findLike(questionId, userId);

  return like;
}

async function toggleQuestionLike(questionId: number, userId: number) {
  await isQuestionIdValid(questionId);
  const like:Like | null = await isQuestionLiked(questionId, userId);

  if(like === null) {
    await likeService.addLike(questionId, userId);
  } else {
    await likeService.removeLike(like.id);
  }
}

async function registerAnswer(
  answer: IRegisterAnswer,
  questionId: number,
  userId: number
) {
  await isQuestionIdValid(questionId);
}

export const questionService = {
  addQuestion,
  findQuestions,
  toggleQuestionLike,
  registerAnswer
};