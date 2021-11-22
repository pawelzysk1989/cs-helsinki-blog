import mongoose from 'mongoose';
import supertest from 'supertest';

import app from '../app';
import BlogModel from '../models/blog';
import { Blog } from '../types/blog';
import blogFixture from './fixtures/blog';

const api = supertest(app);

const getBlogsFromDb = async () => {
  const blogs = await BlogModel.find({});
  return blogs.map((blog) => blog.toJSON());
};

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await BlogModel.deleteMany({});
    await BlogModel.insertMany(blogFixture.blogs.map(({ id, ...blog }) => blog));
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
      const titles = response.body.map((blog: Blog) => blog.title);
      expect(titles).toContain('First class tests');
    });

    test('id is set as identifier of a blog', async () => {
      const response = await api.get('/api/blogs');
      const id = response.body.map((blog: Blog) => blog.id)[0];
      expect(id).toBeDefined();
    });
  });

  describe('POST api/blogs', () => {
    test('succeeds with valid data', async () => {
      const newBlog: Omit<Blog, 'id'> = {
        title: 'New blog',
        author: 'John Doe',
        url: 'Some url',
        likes: 123,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsInDb = await getBlogsFromDb();
      expect(blogsInDb).toHaveLength(blogFixture.blogs.length + 1);

      expect(blogsInDb).toEqual(
        expect.arrayContaining([expect.objectContaining(newBlog)]),
      );
    });
    test('succeeds with default value if poperty likes is missing', async () => {
      const newBlog = {
        title: 'New blog',
        author: 'John Doe',
        url: 'Some url',
      };
      const response = await api.post('/api/blogs').send(newBlog).expect(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newBlog,
          likes: 0,
        }),
      );
    });
    test('fails with status code 400 if title and url is missing', async () => {
      await api
        .post('/api/blogs')
        .send({
          author: 'John Doe',
          likes: 123,
        })
        .expect(400);
      const blogsInDb = await getBlogsFromDb();
      expect(blogsInDb).toHaveLength(blogFixture.blogs.length);
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsInDb = await getBlogsFromDb();
      const blogToDelete = blogsInDb[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsInDbAfter = await getBlogsFromDb();
      expect(blogsInDbAfter).toHaveLength(blogsInDb.length - 1);
      const titles = blogsInDbAfter.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });
  });

  describe('PUT api/blogs/:id', () => {
    test('succeeds with valid data', async () => {
      const blogsInDb = await getBlogsFromDb();
      const blogToUpdate = blogsInDb[0];

      const updatedData: Omit<Blog, 'id'> = {
        title: 'New blog',
        author: 'John Doe',
        url: 'Some url',
        likes: 1,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsInDbAfter = await getBlogsFromDb();
      expect(blogsInDbAfter).toContainEqual(response.body);
      expect(blogsInDbAfter).toHaveLength(blogsInDb.length);
      expect(response.body).toEqual({
        id: blogToUpdate.id,
        ...updatedData,
      });
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
