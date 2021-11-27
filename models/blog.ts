import mongoose from 'mongoose';

import { Blog } from '../types';
import schemaHelper from '../utils/schema_helper';

const schema = new mongoose.Schema<Blog & { user: mongoose.ObjectId }>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

schemaHelper.normalize(schema);

export default mongoose.model('Blog', schema);
