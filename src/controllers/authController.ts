import { Request, Response } from 'express';
import { IUserRegister } from '../types/userTypes';
import { authService } from '../services/authService';

export async function registerUser(req: Request, res: Response) {
  const newUser: IUserRegister = req.body;

  await authService.registerUser(newUser);

  res.sendStatus(201);
}