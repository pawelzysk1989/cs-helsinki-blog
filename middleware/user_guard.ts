import { NextFunction, Request as Req, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user';
import { UserDB } from '../types';
import config from '../utils/config';
import reqestError from '../utils/request_error';

declare global {
  namespace Express {
    interface Request {
      user: UserDB;
    }
  }
}

const userGuard = async (request: Req, response: Response, next: NextFunction) => {
  if (!request.token) {
    return next(reqestError.create('token missing', 401));
  }

  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (typeof decodedToken === 'string' || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await UserModel.findById(decodedToken.id);

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }

  request.user = user;

  return next();
};

export default userGuard;
