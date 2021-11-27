import mongoose from 'mongoose';

import { Blog, UserRegistered } from '../types';
import schemaHelper from '../utils/schema_helper';

const schema = new mongoose.Schema<UserRegistered & { blogs: Blog[] }>({
  username: { type: String, required: true, minlength: 3 },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

schemaHelper.normalize(schema, ['passwordHash']);

export default mongoose.model('User', schema);
