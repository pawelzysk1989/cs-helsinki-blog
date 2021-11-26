import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { RequestError } from '../types';
import logger from './logger';
import responseHelper from './response_helper';

const requestLogger = (request: Request, _response: Response, next: NextFunction) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (
  error: MongooseError.CastError | MongooseError.ValidationError | RequestError,
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error.message);

  if (error.name === 'CastError' && 'kind' in error && error.kind === 'ObjectId') {
    return responseHelper.sendError(response, 400, 'malformatted id');
  }
  if (error.name === 'ValidationError') {
    return responseHelper.sendError(response, 400, error.message);
  }
  if (error.name === 'RequestError') {
    return responseHelper.sendError(response, error.status, error.message);
  }

  return next(error);
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
