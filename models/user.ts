import mongoose from 'mongoose';

import { UserRegistered } from '../types';
import reqestError from '../utils/request_error';
import schemaHelper from '../utils/schema_helper';

const schema = new mongoose.Schema<UserRegistered & { blogs: mongoose.ObjectId[] }>({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

// @ts-ignore
schema.post('save', (err: any, _doc: any, next: Function) => {
  if (
    err.name === 'MongoServerError' &&
    err.code === 11000 &&
    'username' in err.keyValue
  ) {
    next(reqestError.create(`username ${err.keyValue.username} is already taken`));
  } else {
    next(err);
  }
});

schemaHelper.normalize(schema, ['passwordHash']);

export default mongoose.model('User', schema);
