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
import { describe } from 'node:test';
import { CreateOrderDto } from '../../src/orders/dto/createOrder.dto';
import { PaymentMethod } from '../../src/orders/enums/payment-method.enum';
import { IOrderItem } from '../../src/orders/dto/order-item.dto';

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

  describe('AUTH/V1', () => {
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
        return await request(server).get('/api/v1/users').expect(401);
      });

      it('should fail access with invalid token', async () => {
        return await request(server)
          .get('/api/v1/users')
          .set('Authorization', 'Bearer invalid.token.here')
          .expect(401);
      });
    });
  });

  describe('ORDERS/V1', () => {
    const validOrder: CreateOrderDto = {
      paymentMethod: PaymentMethod.CREDIT_CARD,
      items: [{ productId: 'abc123', quantity: 2, unitPrice: 19.99 }],
    };

    it('should create an order with valid data', async () => {
      const response = await request(server)
        .post('/api/v1/orders')
        .send(validOrder)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('orderId');
      expect(response.body.totalAmount).toBe(19.99);
    });

    describe('Validation and Error handling', () => {
      it('should fail when payment method is missing', async () => {
        const { paymentMethod, ...partial } = validOrder;

        return await request(server)
          .post('/api/v1/orders')
          .send(partial)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'paymentMethod should not be empty',
            );
          });
      });

      it('should fail with invalid enum value', async () => {
        return await request(server)
          .post('/api/v1/orders')
          .send({ ...validOrder, paymentMethod: 'wrongmethod' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'paymentMethod must be one of the following values: credit_card, paypal',
            );
          });
      });

      it('should fail when items array is empty', async () => {
        return await request(server)
          .post('/api/v1/orders')
          .send({ ...validOrder, items: [] })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('items should not be empty');
          });
      });

      it('should fail when item is missing quantity', async () => {
        const invalidItems = [{ productId: 'someid', unitPrice: 19.99 }];

        return await request(server)
          .post('/api/v1/orders')
          .send({ ...validOrder, items: invalidItems })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'items.0.quantity must not be less than 1',
            );
          });
      });

      it('should fail when quantity is zero', async () => {
        const invalidItems = [
          { productId: 'someid', unitPrice: 19.99, quantity: 0 },
        ];

        return await request(server)
          .post('/api/v1/orders')
          .send({ ...validOrder, items: invalidItems })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'items.0.quantity must not be less than 1',
            );
          });
      });

      it('should fail when product id is not a string', async () => {
        const invalidItems = [
          { productId: 123, unitPrice: 19.99, quantity: 0 },
        ];

        return await request(server)
          .post('/api/v1/orders')
          .send({ ...validOrder, items: invalidItems })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain(
              'items.0.productId must be a string',
            );
          });
      });
    });
  });
});
