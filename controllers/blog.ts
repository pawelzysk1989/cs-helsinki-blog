import { Router } from 'express';

import BlogModel from '../models/blog';

const blogRouter = Router();

blogRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new BlogModel(request.body);
  const result = await blog.save();
  response.status(201).json(result);
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
