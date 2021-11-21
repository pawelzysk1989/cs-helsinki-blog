import mongoose from 'mongoose';
import supertest from 'supertest';

import app from '../app';
import BlogModel from '../models/blog';
import { Blog } from '../types/blog';
import blogFixture from './fixtures/blog';

const api = supertest(app);

beforeEach(async () => {
  await BlogModel.deleteMany({});
  await BlogModel.insertMany(blogFixture.blogs.map(({ id, ...blog }) => blog));
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blog');
    expect(response.body).toHaveLength(blogFixture.blogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blog');
    const titles = response.body.map((blog: Blog) => blog.title);
    expect(titles).toContain('First class tests');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
