import { Request, Response } from 'express';
import { IUserLogin, IUserRegister } from '../types/userTypes';
import { authService } from '../services/authService';

export async function registerUser(req: Request, res: Response) {
  const newUser: IUserRegister = req.body;

  await authService.registerUser(newUser);

  res.sendStatus(201);
}

export async function loginUser(req: Request, res: Response) {
  const user: IUserLogin = req.body;

  const token: string = await authService.loginUser(user);

  res.status(200).send({ token });
}