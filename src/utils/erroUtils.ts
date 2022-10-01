
type CustomErrorTypes = (
  'not_found' | 'unauthorized' | 'conflict' | 'unprocessable'
);

export interface ICustomError {
  type: CustomErrorTypes;
  message: string | string[]
};

export function isCustomError(error: object) {
  return (error as ICustomError).type !== undefined;
}

export function getErrorStatusCode(type: CustomErrorTypes) {
  switch(type) {
    case 'not_found':
      return 404;
    case 'unauthorized':
      return 401;
    case 'conflict':
      return 409;
    case 'unprocessable':
      return 422;
  }
}

export function notFoundError(message: string | string[]): ICustomError {
  return { type: 'not_found', message };
}

export function unauthorizedError(message: string | string[]): ICustomError {
  return { type: 'unauthorized', message };
}

export function conflictError(message: string | string[]): ICustomError {
  return { type: 'conflict', message };
}

export function unprocessableError(message: string | string[]): ICustomError {
  return { type: 'unprocessable', message };
}