import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { Blog, UserRegistered } from '../types';

const userSchema = new mongoose.Schema<UserRegistered & { blogs: Blog[] }>({
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

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    returnedObject.id = returnedObject._id.toString();
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject._id;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete returnedObject.__v;
  },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
