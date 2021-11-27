import supertest from 'supertest';

import app from '../app';
import UserModel from '../models/user';
import userApiHelper from './helpers/user_api';

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
    await userApiHelper.create({ username: 'root', password: 'sekret' });
  });

  describe('POST /api/users', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersBefore = await userApiHelper.getAll();

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await userApiHelper.getAll();
      expect(usersAfter).toHaveLength(usersBefore.length + 1);

      const usernames = usersAfter.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });

    test('creation fails with username too short', async () => {
      const usersAtStart = await userApiHelper.getAll();

      const newUser = {
        username: 'ro',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain(
        '`username` (`ro`) is shorter than the minimum allowed length (3).',
      );

      const usersAtEnd = await userApiHelper.getAll();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
    test('creation fails with password too short', async () => {
      const usersAtStart = await userApiHelper.getAll();

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'sa',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain(`Password must be at least 3 characters long.`);

      const usersAtEnd = await userApiHelper.getAll();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await userApiHelper.getAll();

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('root is already taken');

      const usersAtEnd = await userApiHelper.getAll();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
});
