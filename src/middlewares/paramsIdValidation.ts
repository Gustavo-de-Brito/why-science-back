import { Request, Response, NextFunction } from 'express';
import { unprocessableError } from '../utils/erroUtils';

async function paramsIdValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = parseInt(req.params.id);

  if(isNaN(id)) throw unprocessableError('O id passado é inválido');

  next();
}


export default paramsIdValidation;