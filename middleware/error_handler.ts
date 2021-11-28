import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';

import { RequestError } from '../types';
import logger from '../utils/logger';

const errorHandler = (
  error:
    | MongooseError.CastError
    | MongooseError.ValidationError
    | RequestError
    | TokenExpiredError
    | JsonWebTokenError,
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error.message);

  if (error.name === 'CastError' && 'kind' in error && error.kind === 'ObjectId') {
    return response.status(400).json({
      error: 'malformatted id',
    });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    });
  }
  if (error.name === 'RequestError' && 'status' in error) {
    return response.status(error.status).json({
      error: error.message,
    });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }

  return next(error);
};

export default errorHandler;
