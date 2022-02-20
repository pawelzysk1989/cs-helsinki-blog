import bcrypt from 'bcryptjs';
import { Router } from 'express';

import authGuard from '../middleware/auth_guard';
import UserModel from '../models/user';
import { UserNotRegistered } from '../types';
import reqestError from '../utils/request_error';
import validateHelper from '../utils/validate_helper';

const userRouter = Router();

userRouter.get('/', async (_request, response) => {
  const users = await UserModel.find({}).populate('blogs');
  response.json(users);
});

userRouter.get('/logged', authGuard, async (request, response) => {
  const user = await request.user.populate('blogs');
  return response.json(user);
});

userRouter.get('/:id', async (request, response, next) => {
  const {
    params: { id },
  } = request;

  const user = await UserModel.findById(id).populate('blogs');

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }
  return response.json(user);
});

userRouter.post('/', authGuard, async (request, response, next) => {
  const { body } = request;

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
