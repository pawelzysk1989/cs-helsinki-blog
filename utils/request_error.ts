import { RequestError } from '../types';

function create(message: string, status = 400): RequestError {
  return {
    name: 'RequestError',
    message,
    status,
  };
}

export default {
  create,
};
