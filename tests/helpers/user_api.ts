import bcrypt from 'bcryptjs';

import UserModel from '../../models/user';
import { UserNotRegistered } from '../../types';

const getAll = async () => {
  const users = await UserModel.find({});
  return users.map((u) => u.toJSON());
};

const create = async ({ password, username, name = 'Superuser' }: UserNotRegistered) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new UserModel({ username, name, passwordHash });
  return user.save();
};

const removeByUsername = async (username: string) =>
  UserModel.findOneAndRemove({ username });

const findByUsername = async (username: string) => UserModel.findOne({ username });
const findById = async (id: string) => UserModel.findById(id);

export default {
  getAll,
  create,
  removeByUsername,
  findByUsername,
  findById,
};
