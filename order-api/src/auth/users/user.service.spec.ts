import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../app.module';
import { Sequelize } from 'sequelize-typescript';

describe('UsersService (integration)', () => {
  let app: INestApplication;
  let service: UsersService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = app.get(UsersService);
    sequelize = app.get(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  afterEach(async () => {
    await sequelize.truncate();
  });

  it('should create a user with a hashed password', async () => {
    const dto: CreateUserDto = {
      email: 'int@test.com',
      password: 'Secret123!',
      name: 'Tester',
    };

    const created = await service.createUser(dto);

    expect(created.email).toBe(dto.email);
    expect(created.name).toBe(dto.name);
    expect(created.password).not.toBe(dto.password);
    expect(await bcrypt.compare(dto.password, created.password)).toBe(true);
  });

  it('should return a user by email', async () => {
    const dto: CreateUserDto = {
      email: 'findme@test.com',
      password: 'Passw0rd!',
      name: 'Finder',
    };
    await service.createUser(dto);

    const found = await service.getUserByEmail(dto.email);

    expect(found).toBeDefined();
    expect(found.email).toBe(dto.email);
  });

  it('should return all users', async () => {
    await service.createUser({
      email: 'user1@test.com',
      password: 'pass1',
      name: 'User1',
    });

    const users = await service.getAllUsers();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThanOrEqual(1);
  });
});
