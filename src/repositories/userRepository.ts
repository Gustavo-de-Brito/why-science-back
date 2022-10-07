import { User } from '@prisma/client';
import prisma from '../databases/postgresSql';
import { UserData } from '../types/userTypes';

async function getUserByName(name: string): Promise<User | null> {
  const user: User | null = await prisma.user.findUnique(
    {
      where: { name }
    }
  );

  return user;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user: User | null = await prisma.user.findUnique(
    {
      where: { email }
    }
  );

  return user;
}

async function getUserById(userId: number): Promise<User | null> {
  const user: User | null = await prisma.user.findUnique(
    {
      where: { id: userId }
    }
  );

  return user;
}



async function insert(user: UserData) {
  await prisma.user.create({data: user});
}

export const userRepository = {
  getUserByName,
  getUserByEmail,
  getUserById,
  insert
};