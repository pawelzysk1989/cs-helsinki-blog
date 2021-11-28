import { Router } from 'express';
import jwt from 'jsonwebtoken';

import BlogModel from '../models/blog';
import UserModel from '../models/user';
import { CreateBlogBody, UpdateBlogBody } from '../types';
import authHelper from '../utils/auth_helper';
import config from '../utils/config';
import reqestError from '../utils/request_error';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const { userId, ...blog }: CreateBlogBody = request.body;

  const token = authHelper.getToken(request);
  if (!token) {
    return next(reqestError.create('token missing', 401));
  }

  const decodedToken = jwt.verify(token, config.SECRET);
  if (typeof decodedToken === 'string' || !decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  const user = await UserModel.findById(decodedToken.id);

  if (!user) {
    return next(reqestError.create(`User with id=${userId} does not exist`, 404));
  }
  const blogModel = new BlogModel({
    ...blog,
    user: user._id,
  });

  const savedBlog = await blogModel.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  return response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await BlogModel.findByIdAndRemove(id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response, next) => {
  const { userId, ...blog }: UpdateBlogBody = request.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    next(reqestError.create(`User with id=${userId} does not exist`, 404));
    return;
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
  });
  response.json(updatedBlog);
});

export default blogRouter;
