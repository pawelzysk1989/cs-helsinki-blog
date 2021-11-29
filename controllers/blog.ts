import { Router } from 'express';

import BlogModel from '../models/blog';
import reqestError from '../utils/request_error';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({}).populate('user');
  response.json(blogs);
});

blogRouter.post('/', async (request, response, next) => {
  const { user, body: blog } = request;

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
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

blogRouter.delete('/:id', async (request, response, next) => {
  const {
    user,
    params: { id },
  } = request;

  if (!user) {
    return next(reqestError.create(`User does not exist`, 404));
  }

  const blog = await BlogModel.findById(id);

  if (!blog) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  if (String(user._id) !== String(blog.user)) {
    return next(reqestError.create(`User not authorized to delete blog`, 403));
  }

  await blog.delete();
  return response.status(204).end();
});

blogRouter.put('/:id', async (request, response, next) => {
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

  const updatedBlog = await BlogModel.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
  });
  return response.status(200).json(updatedBlog);
});

export default blogRouter;
