import mongoose from 'mongoose';
import supertest from 'supertest';

import app from '../app';
import BlogModel from '../models/blog';
import { Blog, BlogResponse } from '../types/blog';
import blogFixture from './fixtures/blog';
import blogApiHelper from './helpers/blog_api';
import userApiHelper from './helpers/user_api';

const api = supertest(app);

const username = 'aux_user';

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await BlogModel.deleteMany({});
    await userApiHelper.removeByUsername(username);
    const createdUser = await userApiHelper.create({ username, password: 'sekret' });
    await BlogModel.insertMany(
      blogFixture.blogs.map((blog) => ({ user: createdUser._id, ...blog })),
    );
  });

  describe('GET api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs');
      expect(response.body).toHaveLength(blogFixture.blogs.length);
    });

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs');
      const titles = response.body.map((blog: BlogResponse) => blog.title);
      expect(titles).toContain('First class tests');
    });

    test('id is set as identifier of a blog', async () => {
      const response = await api.get('/api/blogs');
      const id = response.body.map((blog: BlogResponse) => blog.id)[0];
      expect(id).toBeDefined();
    });
  });

  describe('POST api/blogs', () => {
    test('succeeds with valid data', async () => {
      const requestBody: Blog = {
        title: 'New blog',
        author: 'John Doe',
        url: 'some_url',
        likes: 123,
      };

      await api
        .post('/api/blogs')
        .send(requestBody)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsInDb = await blogApiHelper.getAll();
      expect(blogsInDb).toHaveLength(blogFixture.blogs.length + 1);

      const createdBlog = requestBody;

      expect(blogsInDb).toEqual(
        expect.arrayContaining([expect.objectContaining(createdBlog)]),
      );
    });
    test('succeeds with default value if poperty likes is missing', async () => {
      const requestBody: Omit<Blog, 'likes'> = {
        title: 'New blog',
        author: 'John Doe',
        url: 'Some url',
      };
      const result = await api.post('/api/blogs').send(requestBody).expect(201);

      const createdBlog = requestBody;

      expect(result.body).toEqual(
        expect.objectContaining({
          ...createdBlog,
          likes: 0,
        }),
      );
    });

    test('fails with invalid userId', async () => {
      const nonExistentId = '619c064797982bf3a6b54abe';
      const requestBody: Blog = {
        title: 'New blog',
        author: 'John Doe',
        url: 'Some url',
        likes: 123,
      };

      const result = await api.post('/api/blogs').send(requestBody).expect(404);

      const blogsInDb = await blogApiHelper.getAll();
      expect(blogsInDb).toHaveLength(blogFixture.blogs.length);
      expect(result.body.error).toContain(`User with id=${nonExistentId} does not exist`);
    });

    test('fails with status code 400 if title is missing', async () => {
      const requestBody: Omit<Blog, 'title'> = {
        author: 'John Doe',
        url: 'Some url',
        likes: 123,
      };

      const result = await api.post('/api/blogs').send(requestBody).expect(400);

      const blogsInDb = await blogApiHelper.getAll();
      expect(result.body.error).toContain('`title` is required');
      expect(blogsInDb).toHaveLength(blogFixture.blogs.length);
    });

    test('fails with status code 400 if url is missing', async () => {
      const requestBody: Omit<Blog, 'url'> = {
        title: 'New blog',
        author: 'John Doe',
        likes: 123,
      };

      const result = await api.post('/api/blogs').send(requestBody).expect(400);

      const blogsInDb = await blogApiHelper.getAll();
      expect(result.body.error).toContain('`url` is required');
      expect(blogsInDb).toHaveLength(blogFixture.blogs.length);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsInDb = await blogApiHelper.getAll();
      const blogToDelete = blogsInDb[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsInDbAfter = await blogApiHelper.getAll();
      expect(blogsInDbAfter).toHaveLength(blogsInDb.length - 1);
      const titles = blogsInDbAfter.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });
  });

  describe('PUT api/blogs/:id', () => {
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
        .put(`/api/blogs/${blogId}`)
        .send(requestBody)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsInDbAfter = await blogApiHelper.getAll();
      expect(blogsInDbAfter).toContainEqual(response.body);
      expect(blogsInDbAfter).toHaveLength(blogsInDb.length);

      const blog = requestBody;
      expect(response.body).toEqual({
        id: blogId,
        ...blog,
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
