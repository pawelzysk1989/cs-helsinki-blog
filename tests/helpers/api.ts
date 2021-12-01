import supertest from 'supertest';

import app from '../../app';

const api = supertest(app);

const hook =
  (method: 'post' | 'get' | 'put' | 'delete') => (url: string, token?: string) =>
    token ? api[method](url).set('Authorization', `bearer ${token}`) : api[method](url);

const request = {
  post: hook('post'),
  get: hook('get'),
  put: hook('put'),
  delete: hook('delete'),
};

export default request;
