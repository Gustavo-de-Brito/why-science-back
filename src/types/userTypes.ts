import { User } from '@prisma/client';

export interface IUserRegister {
  name: string;
  email: string;
  imageUrl: string;
  password: string;
  confirmPassword: string;
};

export interface IUserLogin {
  email: string;
  password: string;
}

export type UserData = Omit<User, 'id'>;