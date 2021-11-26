import { Response } from 'express';

import { ResponseError } from '../types';
import responseError from './response_error';

const sendError = (
  response: Response,
  status: number,
  message: string,
): Response<ResponseError> => {
  return response.status(status).json(responseError.create(message));
};

export default {
  sendError,
};
