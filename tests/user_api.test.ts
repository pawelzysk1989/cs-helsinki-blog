import bcrypt from 'bcryptjs';
import supertest from 'supertest';

import app from '../app';
import UserModel from '../models/user';

const api = supertest(app);

const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map((u) => u.toJSON());
};
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new UserModel({ username: 'root', name: 'Superuser', passwordHash });

    await user.save();
  });

  describe('POSET /api/users', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersBefore = await usersInDb();

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

      const usersAfter = await usersInDb();
      expect(usersAfter).toHaveLength(usersBefore.length + 1);

      const usernames = usersAfter.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await usersInDb();

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

      expect(result.body.error).toContain('`username` to be unique');

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
});
