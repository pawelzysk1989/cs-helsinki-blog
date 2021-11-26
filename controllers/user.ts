import bcrypt from 'bcryptjs';
import { Router } from 'express';

import UserModel from '../models/user';
import { UserNotRegistered } from '../types';

const userRouter = Router();

userRouter.get('/', async (_request, response) => {
  const users = await UserModel.find({}).populate('blogs');
  response.json(users);
});

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body as UserNotRegistered;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new UserModel({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

export default userRouter;
