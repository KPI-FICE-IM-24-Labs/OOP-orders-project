import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { App } from 'supertest/types';

describe('App E2E (e2e)', () => {
  let app: INestApplication;
  let server: App;
  let authToken: string;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, prefix: 'v' });
    await app.init();
    server = app.getHttpServer() as App;
    sequelize = app.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.truncate();
    await sequelize.close();
    await app.close();
  });

  it('/api (GET) should return 200', () => {
    return request(server).get('/api').expect(200);
  });

  it('/api/v1/auth/signup (POST) should create a new user', async () => {
    return await request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'Pass123!',
        name: 'test',
      })
      .expect(201);
  });

  it('/api/v1/auth/signin (POST) should return a valid JWT token', async () => {
    const res = await request(server)
      .post('/api/v1/auth/signin')
      .send({
        email: 'test@test.com',
        password: 'Pass123!',
      })
      .expect(200);

    expect(res.body).toHaveProperty('auth_token');
    authToken = (res.body as { auth_token: string }).auth_token;
  });

  it('/api/v1/users (GET) should return all users', async () => {
    const res = await request(server)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/api/v1/users/search?email= (GET) should return user by email', async () => {
    const res = await request(server)
      .get('/api/v1/users/search')
      .query({ email: 'test@test.com' })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect((res.body as { email: string }).email).toBe('test@test.com');
  });

  describe('Validation and Error Handling', () => {
    it('should fail signup with missing fields', async () => {
      const res = await request(server)
        .post('/api/v1/auth/signup')
        .send({})
        .expect(400);

      expect((res.body as { message: string }).message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('email'),
          expect.stringContaining('password'),
          expect.stringContaining('name'),
        ]),
      );
    });

    it('should fail signup with invalid email format', async () => {
      const res = await request(server)
        .post('/api/v1/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'Pass123!',
          name: 'test',
        })
        .expect(400);

      expect((res.body as { message: string }).message).toEqual(
        expect.arrayContaining([expect.stringContaining('email')]),
      );
    });

    it('should fail signup with weak password', async () => {
      const res = await request(server)
        .post('/api/v1/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: '123',
          name: 'test',
        })
        .expect(400);

      expect((res.body as { message: string }).message).toEqual(
        expect.arrayContaining([expect.stringContaining('password')]),
      );
    });

    it('should fail signin with missing password', async () => {
      return await request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@test.com',
        })
        .expect(401);
    });

    it('should fail signin with wrong password', async () => {
      const res = await request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: 'test@test.com',
          password: 'WrongPass123!',
        })
        .expect(401);

      expect((res.body as { message: string }).message).toContain(
        'Credentials are incorrect',
      );
    });

    it('should fail access to protected route without token', async () => {
      await request(server).get('/api/v1/users').expect(401);
    });

    it('should fail access with invalid token', async () => {
      await request(server)
        .get('/api/v1/users')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });
  });
});
