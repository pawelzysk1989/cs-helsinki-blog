import mongoose, { Schema } from 'mongoose';

import { BlogDB } from '../types';
import schemaHelper from '../utils/schema_helper';

const schema = new Schema<BlogDB>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

schemaHelper.normalize(schema);

export default mongoose.model('Blog', schema);
