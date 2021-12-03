import mongoose from 'mongoose';

import BlogModel from '../models/blog';
import { Blog, BlogResponse } from '../types/blog';
import blogFixture from './fixtures/blog';
import api from './helpers/api';
import blogApiHelper from './helpers/blog_api';
import userApiHelper from './helpers/user_api';

const username = 'aux_user';
const password = 'sekret';

let token = '';

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await BlogModel.deleteMany({});
    await userApiHelper.removeByUsername(username);
    const createdUser = await userApiHelper.create({ username, password });
    await BlogModel.insertMany(
      blogFixture.blogs.map((blog) => ({ user: createdUser._id, ...blog })),
    );
    const loginResponse = await api.post('/api/login').send({
      username,
      password,
    });
    token = loginResponse.body.token;
  });

  describe('GET api/blogs', () => {
    describe('with authorization', () => {
      test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs', token)
          .expect(200)
          .expect('Content-Type', /application\/json/);
      });

      test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs', token);
        expect(response.body).toHaveLength(blogFixture.blogs.length);
      });

      test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs', token);
        const titles = response.body.map((blog: BlogResponse) => blog.title);
        expect(titles).toContain('First class tests');
      });

      test('id is set as identifier of a blog', async () => {
        const response = await api.get('/api/blogs', token);
        const id = response.body.map((blog: BlogResponse) => blog.id)[0];
        expect(id).toBeDefined();
      });
    });

    describe('without authorization', () => {
      test('fails with status code 401 and error message', async () => {
        const response = await api.get('/api/blogs').expect(401);
        expect(response.body.error).toContain('token missing');
      });
    });
  });

  describe('POST api/blogs', () => {
    describe('with authorization', () => {
      test('succeeds with valid data', async () => {
        const requestBody: Blog = {
          title: 'New blog',
          author: 'John Doe',
          url: 'some_url',
          likes: 123,
        };

        await api
          .post('/api/blogs', token)
          .send(requestBody)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const blogsInDb = await blogApiHelper.getAll();
        expect(blogsInDb).toHaveLength(blogFixture.blogs.length + 1);

        expect(blogsInDb).toEqual(
          expect.arrayContaining([expect.objectContaining(requestBody)]),
        );
      });
      test('succeeds with default value if poperty likes is missing', async () => {
        const requestBody: Omit<Blog, 'likes'> = {
          title: 'New blog',
          author: 'John Doe',
          url: 'Some url',
        };
        const response = await api
          .post('/api/blogs', token)
          .send(requestBody)
          .expect(201);

        expect(response.body).toEqual(
          expect.objectContaining({
            ...requestBody,
            likes: 0,
          }),
        );
      });

      test('fails with status code 400 if title is missing', async () => {
        const requestBody: Omit<Blog, 'title'> = {
          author: 'John Doe',
          url: 'Some url',
          likes: 123,
        };

        const response = await api
          .post('/api/blogs', token)
          .send(requestBody)
          .expect(400);

        const blogsInDb = await blogApiHelper.getAll();
        expect(response.body.error).toContain('`title` is required');
        expect(blogsInDb).toHaveLength(blogFixture.blogs.length);
      });

      test('fails with status code 400 if url is missing', async () => {
        const requestBody: Omit<Blog, 'url'> = {
          title: 'New blog',
          author: 'John Doe',
          likes: 123,
        };

        const response = await api
          .post('/api/blogs', token)
          .send(requestBody)
          .expect(400);

        const blogsInDb = await blogApiHelper.getAll();
        expect(response.body.error).toContain('`url` is required');
        expect(blogsInDb).toHaveLength(blogFixture.blogs.length);
      });
    });

    describe('without authorization', () => {
      test('fails with status code 401 and error message', async () => {
        const response = await api.post('/api/blogs').expect(401);
        expect(response.body.error).toContain('token missing');
      });
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    describe('with authorization', () => {
      test('succeeds with status code 204 if id is valid', async () => {
        const blogsInDb = await blogApiHelper.getAll();
        const blogToDelete = blogsInDb[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`, token).expect(204);
        const blogsInDbAfter = await blogApiHelper.getAll();
        expect(blogsInDbAfter).toHaveLength(blogsInDb.length - 1);
        const titles = blogsInDbAfter.map((blog) => blog.title);
        expect(titles).not.toContain(blogToDelete.title);
      });
    });
    describe('without authorization', () => {
      test('fails with status code 401 and error message', async () => {
        const blogsInDb = await blogApiHelper.getAll();
        const blogToDelete = blogsInDb[0];
        const response = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
        expect(response.body.error).toContain('token missing');
      });
    });
  });

  describe('PUT api/blogs/:id', () => {
    describe('with authorization', () => {
      test('succeeds with valid data', async () => {
        const blogsInDb = await blogApiHelper.getAll();
        const blogToUpdate = blogsInDb[0];

        const requestBody: Blog = {
          title: 'New blog',
          author: 'John Doe',
          likes: 123,
          url: 'some url',
        };

        const blogId = blogToUpdate.id;

        const response = await api
          .put(`/api/blogs/${blogId}`, token)
          .send(requestBody)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        const blogsInDbAfter = await blogApiHelper.getAll();
        expect(blogsInDbAfter).toHaveLength(blogsInDb.length);

        expect(response.body).toEqual({
          id: blogId,
          user: blogToUpdate.user,
          ...requestBody,
        });
      });
    });

    describe('without authorization', () => {
      test('fails with status code 401 and error message', async () => {
        const blogsInDb = await blogApiHelper.getAll();
        const blogToUpdate = blogsInDb[0];

        const blogId = blogToUpdate.id;
        const response = await api.put(`/api/blogs/${blogId}`).send({}).expect(401);
        expect(response.body.error).toContain('token missing');
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
