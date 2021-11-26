import mongoose from 'mongoose';

import { Blog, User } from '../types';
import schemaHelper from '../utils/schema_helper';

const schema = new mongoose.Schema<Blog & { user: User }>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

schemaHelper.normalize(schema);

export default mongoose.model('Blog', schema);
