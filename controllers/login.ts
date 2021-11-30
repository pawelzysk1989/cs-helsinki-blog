import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { LoginRequestBody } from '../types/login';
import config from '../utils/config';
import reqestError from '../utils/request_error';

const loginRouter = Router();

loginRouter.post('/', async (request, response, next) => {
  const { username, password }: LoginRequestBody = request.body;

  const user = await User.findOne({ username });

  if (!user) {
    return next(reqestError.create('invalid username', 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    return next(reqestError.create('invalid password', 401));
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });

  return response.status(200).send({ token, username: user.username, name: user.name });
});

export default loginRouter;
