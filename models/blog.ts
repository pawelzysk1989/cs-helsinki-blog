import mongoose from 'mongoose';

import { Blog } from '../types/blog';

const blogSchema = new mongoose.Schema<Blog>({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

export default mongoose.model('Blog', blogSchema);
