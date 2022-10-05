import { Question } from '@prisma/client';

export interface IQuestionRegister {
  title: string;
  categoryId?: number;
  newCategoryName?: string;
};