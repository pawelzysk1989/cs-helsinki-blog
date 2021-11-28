import { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';

const requestLogger = (request: Request, _response: Response, next: NextFunction) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

export default requestLogger;
