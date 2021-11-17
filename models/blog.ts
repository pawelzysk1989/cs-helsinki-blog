import mongoose from 'mongoose';

import { Blog } from '../types/blog';
import { MONGODB_URI } from '../utils/config';

const blogSchema = new mongoose.Schema<Blog>({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl ?? '');

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete returnedObject._id;
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    delete returnedObject.__v;
  },
});

export default mongoose.model('Blog', blogSchema);
