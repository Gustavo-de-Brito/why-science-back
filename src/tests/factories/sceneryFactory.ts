import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { userFactory } from './userFactory';
import prisma from '../../databases/postgresSql';

dotenv.config();

export async function userRegistered() {
  const newUser = await userFactory();

  const encryptedPassword = bcrypt
    .hashSync(newUser.password, Number(process.env.BCRYPT_SALT));

  const dbUser = { ...newUser, password: encryptedPassword };

  await prisma.user.create({ data: dbUser });

  return newUser;
}