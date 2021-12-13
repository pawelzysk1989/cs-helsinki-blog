import { Router } from 'express';

import Blog from '../models/blog';
import User from '../models/user';

const testingRouter = Router();

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  response.status(204).end();
});

export default testingRouter;
