import { Router } from 'express';

import authGuard, { getUserId } from '../middleware/auth_guard';
import BlogModel from '../models/blog';
import CommentModel from '../models/comment';
import UserModel from '../models/user';
import { UserDB } from '../types';
import reqestError from '../utils/request_error';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({}).populate('user');
  return response.json(blogs);
});

blogRouter.get('/:id', authGuard, async (request, response, next) => {
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

blogRouter.post('/', authGuard, async (request, response, next) => {
  const { auth, body: blog } = request;

  const userId = getUserId(auth);

  const user = await UserModel.findById(userId).populate('blogs');

  if (!user) {
    return next(reqestError.create('User does not exist', 404));
  }

  const newBlog = new BlogModel({
    ...blog,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs.push(savedBlog._id);
  await user.save();
  return response.status(201).json(savedBlog.populate('user'));
});

blogRouter.post('/:id/comment', authGuard, async (request, response, next) => {
  const {
    body: comment,
    params: { id },
  } = request;

  const blog = await BlogModel.findById(id);

  if (!blog) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  const newComment = new CommentModel({
    ...comment,
    user: blog.user,
    blog: blog._id,
  });

  const savedComment = await newComment.save();
  blog.comments.push(savedComment._id);
  await blog.save();
  return response.status(201).json(savedComment);
});

blogRouter.delete('/:id', authGuard, async (request, response, next) => {
  const {
    auth,
    params: { id },
  } = request;

  const blogToDelete = await BlogModel.findById(id);

  if (!blogToDelete) {
    return next(reqestError.create(`Blog does not exist`, 404));
  }

  const userId = getUserId(auth);

  if (userId !== blogToDelete.user.toString()) {
    return next(reqestError.create(`User not authorized to delete blog`, 403));
  }

  const { user }: { user: UserDB } = await blogToDelete.populate('user');

  user.blogs = user.blogs.filter((blogId) => String(blogId) !== id);
  await user.save();
  await blogToDelete.delete();
  return response.status(204).end();
});

blogRouter.put('/:id', authGuard, async (request, response, next) => {
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
