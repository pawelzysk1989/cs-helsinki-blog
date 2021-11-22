import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import blogRouter from './controllers/blog';
import config from './utils/config';
import logger from './utils/logger';
import middleware from './utils/middleware';

const app = express();

const mongoUri = config.MONGODB_URI ?? '';
logger.info('connecting to', mongoUri);

mongoose
  .connect(mongoUri)
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
