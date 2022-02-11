import bcrypt from 'bcryptjs';
import { Router } from 'express';

import userExtractor from '../middleware/user_extractor';
import UserModel from '../models/user';
import { UserNotRegistered } from '../types';
import reqestError from '../utils/request_error';
import validateHelper from '../utils/validate_helper';

const userRouter = Router();

userRouter.get('/', async (_request, response) => {
  const users = await UserModel.find({}).populate('blogs');
  response.json(users);
});

userRouter.get('/:id', userExtractor, async (request, response, next) => {
  const {
    user: authUser,
    params: { id },
  } = request;

  if (!authUser) {
    return next(reqestError.create(`User does not exist`, 404));
  }

  const user = await UserModel.findById(id).populate('blogs');

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }
  return response.json(user);
});

userRouter.post('/', userExtractor, async (request, response, next) => {
  const { user, body } = request;

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }

  const newUser: UserNotRegistered = body;

  const userValidation = validateHelper.validate(newUser, [
    ({ password }) => validateHelper.minLength({ length: 3, name: 'Password' })(password),
  ]);
  if (userValidation?.error) {
    return next(reqestError.create(userValidation.error, 400));
  }

  const passwordHash = await bcrypt.hash(newUser.password, 10);

  const userModel = new UserModel({
    username: newUser.username,
    name: newUser.name,
    passwordHash,
  });

  const savedUser = await userModel.save();

  return response.json(savedUser);
});

export default userRouter;
