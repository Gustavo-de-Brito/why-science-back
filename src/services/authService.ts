import bcyrpt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { User } from '@prisma/client';
import { IUserLogin, IUserRegister, UserData } from '../types/userTypes';
import { userRepository } from '../repositories/userRepository'
import { conflictError, unauthorizedError } from '../utils/erroUtils';

dotenv.config();

async function isUserNameRegistered(name: string): Promise<void> {
  const user: User | null = await userRepository.getUserByName(name);

  if(user) throw conflictError('o nome de usuário já está registrado');
}

async function isEmailAlreadyRegistered(email: string): Promise<void> {
  const user: User | null = await userRepository.getUserByEmail(email);

  if(user) throw conflictError('o email de usuário já está registrado');
}

async function registerUser(user: IUserRegister) {
  await isUserNameRegistered(user.name);
  await isEmailAlreadyRegistered(user.email);

  const encryptedPassword: string = bcyrpt.hashSync(user.password, 10);

  const newUser: UserData = {
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    password: encryptedPassword
  }

  await userRepository.insert(newUser);
}

async function isEmailRegistered(email: string): Promise<User> {
  const user: User | null = await userRepository.getUserByEmail(email);

  if(!user) throw unauthorizedError('dados de login inválidos');

  return user;
}

function checkPassword(dbPassword: string, reqPassword: string) {
  const isPasswordCorrect = bcyrpt.compareSync(reqPassword, dbPassword);

  if(!isPasswordCorrect) throw unauthorizedError('dados de login inválidos');
}

async function loginUser(user: IUserLogin): Promise<string> {
  const userData = await isEmailRegistered(user.email);
  checkPassword(userData.password, user.password);

  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ??  '';
  const EXPIRATION_TIME = 60 * 60 * 3;

  const token = jwt.sign(
    { userId: userData.id},
    JWT_PRIVATE_KEY,
    { expiresIn: EXPIRATION_TIME}
  );

  return token;
}

export const authService = {
  registerUser,
  loginUser
};