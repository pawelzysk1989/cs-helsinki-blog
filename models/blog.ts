import mongoose from 'mongoose';
import { Blog } from '../types/blog';
import { MONGODB_URI } from '../utils/config';

const blogSchema = new mongoose.Schema<Blog>({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = MONGODB_URI;
mongoose.connect(mongoUrl ?? '');

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model('Blog', blogSchema);
