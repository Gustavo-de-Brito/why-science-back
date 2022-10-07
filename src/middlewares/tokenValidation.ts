import { Request, Response, NextFunction } from 'express';
import { unauthorizedError, unprocessableError } from '../utils/erroUtils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '@prisma/client';
import { authService } from '../services/authService';

dotenv.config();

async function tokenValidation(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if(!authorization?.includes('Bearer ')) {
    throw unprocessableError('a requisição deve possuir um token no formato Bearer');
  }

  const token = authorization?.replace('Bearer ', '');

  try {
    const JWT_PRIVATE_KEY: string = process.env.JWT_PRIVATE_KEY ?? '';
    const userIdentification = jwt.verify(token, JWT_PRIVATE_KEY) as { userId: number};

    const user:User | null = await authService.getUserById(userIdentification.userId);

    if(user === null) throw unauthorizedError('O token é inválido');

    res.locals.userData = user;
  } catch {
    throw unauthorizedError('O token passado é inválido ou está expirado');
  }

  next();
}

export default tokenValidation;