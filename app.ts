import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import blogRouter from './controllers/blog';
import loginRouter from './controllers/login';
import userRouter from './controllers/user';
import config from './utils/config';
import logger from './utils/logger';
import middleware from './utils/middleware';

const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error: Error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
