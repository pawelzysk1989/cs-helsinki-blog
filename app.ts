import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import blogRouter from './controllers/blog';
import testingRouter from './controllers/testing';
import userRouter from './controllers/user';
import errorHandler from './middleware/error_handler';
import requestLogger from './middleware/logger';
import unknownEndpoint from './middleware/unknown_endpoint';
import config from './utils/config';
import logger from './utils/logger';

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
app.use(requestLogger);

app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

if (config.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
