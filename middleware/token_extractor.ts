import { NextFunction, Request as Req, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

const tokenExtractor = (request: Req, _response: Response, next: NextFunction) => {
  const authorization = request.get('authorization');
  const prefix = 'bearer ';
  if (authorization && authorization.toLowerCase().startsWith(prefix)) {
    request.token = authorization.substring(prefix.length);
  }
  next();
};

export default tokenExtractor;
