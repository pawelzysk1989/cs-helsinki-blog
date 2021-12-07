import { Router } from 'express';

import userExtractor from '../middleware/user_extractor';
import BlogModel from '../models/blog';
import reqestError from '../utils/request_error';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response, next) => {
  const { user, body: blog } = request;

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }
  const newBlog = new BlogModel({
    ...blog,
    user: user._id,
  });

  const savedBlog = await (await newBlog.save()).populate('user');
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  return response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const {
    user,
    params: { id },
  } = request;

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }

  const blogToDelete = await BlogModel.findById(id);

  if (!blogToDelete) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  if (String(user._id) !== String(blogToDelete.user)) {
    return next(reqestError.create(`User not authorized to delete blog`, 403));
  }

  user.blogs = user.blogs.filter((blogId) => String(blogId) !== id);
  await user.save();
  await blogToDelete.delete();
  return response.status(204).end();
});

blogRouter.put('/:id', userExtractor, async (request, response, next) => {
  const {
    user,
    body: blog,
    params: { id },
  } = request;

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }

  const blogToUpdate = await BlogModel.findById(id);

  if (!blogToUpdate) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  if (String(user._id) !== String(blogToUpdate.user)) {
    return next(reqestError.create(`User not authorized to update blog`, 403));
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(id, blog, { new: true });
  return response.status(200).json(updatedBlog);
});

export default blogRouter;
