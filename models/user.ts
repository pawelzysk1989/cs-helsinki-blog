import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Blog, UserRegistered } from '../types';
import schemaHelper from '../utils/schema_helper';

const schema = new mongoose.Schema<UserRegistered & { blogs: Blog[] }>({
  username: { type: String, required: true, unique: true },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

schemaHelper.normalize(schema);

schema.plugin(uniqueValidator);

export default mongoose.model('User', schema);
