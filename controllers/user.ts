import bcrypt from 'bcryptjs';
import { Router } from 'express';

import UserModel from '../models/user';
import { UserNotRegistered } from '../types';
import reqestError from '../utils/request_error';
import validateHelper from '../utils/validate_helper';

const userRouter = Router();

userRouter.get('/', async (_request, response) => {
  const users = await UserModel.find({}).populate('blogs');
  response.json(users);
});

userRouter.post('/', async (request, response, next) => {
  const user: UserNotRegistered = request.body;

  const userValidation = validateHelper.validate(user, [
    ({ password }) => validateHelper.minLength({ length: 3, name: 'Password' })(password),
  ]);
  if (userValidation?.error) {
    return next(reqestError.create(userValidation.error, 400));
  }

  const passwordHash = await bcrypt.hash(user.password, 10);

  const userModel = new UserModel({
    username: user.username,
    name: user.name,
    passwordHash,
  });

  const savedUser = await userModel.save();

  return response.json(savedUser);
});

export default userRouter;
