import { Answer } from '@prisma/client';

export type AnswerData = Omit<Answer, 'id'>;

export interface IRegisterAnswer {
  text: string;
};