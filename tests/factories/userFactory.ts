import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import prisma from '../../src/databases/postgresSql';
import { UserData, IUserRegister } from '../../src/types/userTypes';
import { User } from '@prisma/client';

dotenv.config()

export async function userFactory(): Promise<UserData> {
  const password: string = faker.internet.password();

  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    imageUrl: faker.internet.url(),
    password,
  };
}

export async function registerUserFactory(): Promise<IUserRegister> {
  const password: string = faker.internet.password();

  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    imageUrl: faker.internet.url(),
    password,
    confirmPassword: password
  };
}

export async function dbUserFactory() {
  const newUser = await userFactory();

  const encryptedPassword = bcrypt
    .hashSync(newUser.password, Number(process.env.BCRYPT_SALT));

  const dbUser = { ...newUser, password: encryptedPassword };

  const registeredUser = await prisma.user.create({ data: dbUser });

  return registeredUser;
}

export async function tokenFactory(userId: number) {
  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? '';

  const token = jwt.sign({ userId }, JWT_PRIVATE_KEY);

  return token;
}