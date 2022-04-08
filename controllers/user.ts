import { Router } from 'express';

import authGuard from '../middleware/auth_guard';
import UserModel from '../models/user';
import reqestError from '../utils/request_error';

const userRouter = Router();

userRouter.get('/', authGuard, async (_request, response) => {
  const users = await UserModel.find({}).populate('blogs');
  return response.json(users);
});

userRouter.get('/:id', authGuard, async (request, response, next) => {
  const {
    params: { id },
  } = request;

  const user = await UserModel.findById(id).populate('blogs');

  if (!user) {
    return next(reqestError.create('User does not exist', 404));
  }
  return response.json(user);
});

export default userRouter;
