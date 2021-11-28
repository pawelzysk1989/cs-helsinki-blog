import { Request } from 'express';

const getToken = (request: Request) => {
  const authorization = request.get('authorization');
  const prefix = 'bearer ';
  if (authorization && authorization.toLowerCase().startsWith(prefix)) {
    return authorization.substring(prefix.length);
  }
  return null;
};

export default {
  getToken,
};
