import { Router } from 'express';

import userGuard from '../middleware/user_guard';
import BlogModel from '../models/blog';
import CommentModel from '../models/comment';
import reqestError from '../utils/request_error';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({}).populate('user');
  return response.json(blogs);
});

blogRouter.get('/:id', userGuard, async (request, response, next) => {
  const {
    params: { id },
  } = request;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  const populatedBlog = await blog.populate([
    {
      path: 'comments',
      populate: [
        {
          path: 'user',
        },
        {
          path: 'blog',
          populate: {
            path: 'user',
          },
        },
      ],
    },
    {
      path: 'user',
    },
  ]);

  return response.json(populatedBlog);
});

blogRouter.post('/', userGuard, async (request, response) => {
  const { user, body: blog } = request;

  const newBlog = new BlogModel({
    ...blog,
    user: user._id,
  });

  const savedBlog = await (await newBlog.save()).populate('user');
  user.blogs.push(savedBlog._id);
  await user.save();
  return response.status(201).json(savedBlog);
});

blogRouter.post('/:id/comment', userGuard, async (request, response, next) => {
  const {
    user,
    body: comment,
    params: { id },
  } = request;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  const newComment = new CommentModel({
    ...comment,
    user: user._id,
    blog: blog._id,
  });

  const savedComment = await newComment.save();
  blog.comments.push(savedComment._id);
  await blog.save();
  return response.status(201).json(savedComment);
});

blogRouter.delete('/:id', userGuard, async (request, response, next) => {
  const {
    user,
    params: { id },
  } = request;

  const blogToDelete = await BlogModel.findById(id);

  if (!blogToDelete) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  if (user._id.toString() !== blogToDelete.user.toString()) {
    return next(reqestError.create(`User not authorized to delete blog`, 403));
  }

  user.blogs = user.blogs.filter((blogId) => String(blogId) !== id);
  await user.save();
  await blogToDelete.delete();
  return response.status(204).end();
});

blogRouter.put('/:id', userGuard, async (request, response, next) => {
  const {
    body: blog,
    params: { id },
  } = request;

  const blogToUpdate = await BlogModel.findById(id);

  if (!blogToUpdate) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  const updatedBlog = await BlogModel.findByIdAndUpdate(id, blog, { new: true }).populate(
    'user',
  );
  return response.status(200).json(updatedBlog);
});

export default blogRouter;
