import { MONGODB_URI } from './utils/config';

import express from 'express';
import cors from 'cors';
import blogRouter from './controllers/blog';
import middleware from './utils/middleware';
import logger from './utils/logger';
import mongoose from 'mongoose';

const app = express();

logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI ?? '')
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error: Error) => {
    logger.error('error connection to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
