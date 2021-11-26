import { Router } from 'express';

import BlogModel from '../models/blog';
import UserModel from '../models/user';
import reqestError from '../utils/request_error';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const {
    body: { userId, ...blog },
  } = request;
  const user = await UserModel.findById(userId);
  if (!user) {
    next(reqestError.create(`User with id=${userId} does not exist`, 404));
    return;
  }
  const blogModel = new BlogModel({
    ...blog,
    user: user._id,
  });

  const savedBlog = await blogModel.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await BlogModel.findByIdAndRemove(id);
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const updatedBlog = await BlogModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  response.json(updatedBlog);
});

export default blogRouter;
