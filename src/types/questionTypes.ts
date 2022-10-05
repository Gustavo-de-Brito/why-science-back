import { Question } from '@prisma/client';

export interface IQuestionRegister {
  text: string;
  categoryId?: number;
  newCategoryName?: string;
};

export type QuestionData = Omit<Question, 'id'>;