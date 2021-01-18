import app from '@framework/server/setup/app';
import request from 'supertest';
import { auth } from '@framework/server/middleware/auth';
import faker from 'faker';
import RedisCacheDriver from '@framework/db/redis/index';

beforeAll(async () => {
  await RedisCacheDriver.open();
});

afterAll(async () => {
  await RedisCacheDriver.close();
});

describe('Auth Middleware', () => {
  test('Should return 403 if unauthenticated', async () => {
    app.post('/test-auth', auth, (req, res) => {
      res.send(req.body);
    });
    await request(app).post('/test-auth').expect(403);
  });

  test('Should return 403 if invalid token', async () => {
    app.post('/test-auth-invalid-token', auth, (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post('/test-auth-invalid-token')
      .set('access-token', faker.random.uuid())
      .expect(403);
  });
});
