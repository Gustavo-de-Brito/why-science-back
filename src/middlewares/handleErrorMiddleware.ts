import { Request, Response, NextFunction } from 'express';
import { ICustomError, isCustomError, getErrorStatusCode } from '../utils/erroUtils';

function handlerErrorsMiddleware(
  err: TypeError | ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if( isCustomError(err) ) {
    const statusCode = getErrorStatusCode((err as ICustomError).type);

    return res.status(statusCode).send(err.message);
  }
  console.log(err)
  res.sendStatus(500);
}

export default handlerErrorsMiddleware;