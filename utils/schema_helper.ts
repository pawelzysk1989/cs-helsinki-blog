import { Schema } from 'mongoose';

const normalize = <T>(schema: Schema<T>): void => {
  schema.set('toJSON', {
    transform: (_document, returnedObject) => {
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      returnedObject.id = returnedObject._id.toString();
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      delete returnedObject._id;
      // eslint-disable-next-line no-underscore-dangle, no-param-reassign
      delete returnedObject.__v;
    },
  });
};

export default {
  normalize,
};
