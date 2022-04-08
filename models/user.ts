import mongoose from 'mongoose';

import { UserDB } from '../types';
import requestError from '../utils/request_error';
import schemaHelper from '../utils/schema_helper';

const schema = new mongoose.Schema<UserDB>({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
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
    next(requestError.create(`username ${err.keyValue.username} is already taken`));
  } else {
    next(err);
  }
});

schemaHelper.normalize(schema, ['password']);

export default mongoose.model('User', schema);
