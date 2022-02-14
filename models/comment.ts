import mongoose, { Schema } from 'mongoose';

import { CommentDB } from '../types';
import schemaHelper from '../utils/schema_helper';

const schema = new Schema<CommentDB>({
  text: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  blog: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Blog',
  },
});

schemaHelper.normalize(schema);

export default mongoose.model('Comment', schema);
