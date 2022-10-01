import bcyrpt from 'bcrypt';
import dotenv from 'dotenv';

import { User } from '@prisma/client';
import { IUserRegister, UserData } from '../types/userTypes';
import { userRepository } from '../repositories/userRepository'
import { conflictError } from '../utils/erroUtils';

dotenv.config();

async function isUserNameRegistered(name: string): Promise<void> {
  const user: User | null = await userRepository.getUserByName(name);

  if(user) throw conflictError('o nome de usuário já está registrado');
}

async function isEmailRegistered(email: string): Promise<void> {
  const user: User | null = await userRepository.getUserByEmail(email);

  if(user) throw conflictError('o email de usuário já está registrado');
}

async function registerUser(user: IUserRegister) {
  await isUserNameRegistered(user.name);
  await isEmailRegistered(user.email);

  const SALT = Number(process.env.BCRYPT_SALT) || 10;

  const encryptedPassword: string = bcyrpt.hashSync(user.name, SALT);

  const newUser: UserData = {
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    password: encryptedPassword
  }

  await userRepository.insert(newUser);
}

export const authService = {
  registerUser
};