import { ResponseError } from '../types';

function create(error: string): ResponseError {
  return {
    error,
  };
}

export default {
  create,
};
