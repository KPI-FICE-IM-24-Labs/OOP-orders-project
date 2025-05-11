import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppModule } from '../app.module';
import { Sequelize } from 'sequelize-typescript';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPayload } from './IPayload';

describe('AuthService (integration)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let jwtService: JwtService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = app.get(AuthService);
    jwtService = app.get(JwtService);
    sequelize = app.get(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  afterEach(async () => {
    await sequelize.truncate();
  });

  describe('signup()', () => {
    it('should create a user with hashed password', async () => {
      const dto: CreateUserDto = {
        email: 'signup@test.com',
        password: 'Secret123!',
        name: 'Newbie',
      };

      const user = await authService.signup(dto);

      expect(user.email).toBe(dto.email);
      expect(user.name).toBe(dto.name);
      expect(user.password).not.toBe(dto.password);
      expect(await bcrypt.compare(dto.password, user.password)).toBe(true);
    });
  });

  describe('validateUser()', () => {
    it('should return user DTO if credentials are correct', async () => {
      const dto: CreateUserDto = {
        email: 'login@test.com',
        password: 'Password1!',
        name: 'Login User',
      };

      await authService.signup(dto);
      const validated = await authService.validateUser(dto.email, dto.password);

      expect(validated).toBeDefined();
      expect(validated.email).toBe(dto.email);
      expect(validated.name).toBe(dto.name);
      expect(validated).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const dto: CreateUserDto = {
        email: 'wrongpass@test.com',
        password: 'Correct123!',
        name: 'WrongPass',
      };

      await authService.signup(dto);

      await expect(
        authService.validateUser(dto.email, 'WrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      await expect(
        authService.validateUser('noone@test.com', 'Password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signin()', () => {
    it('should return JWT token for valid user DTO', async () => {
      const dto: CreateUserDto = {
        email: 'jwt@test.com',
        password: 'JwtPass123',
        name: 'JWT Tester',
      };

      await authService.signup(dto);
      const userDto = await authService.validateUser(dto.email, dto.password);
      const result = await authService.signin(userDto);

      expect(result).toHaveProperty('auth_token');
      const decoded: IPayload = await jwtService.verifyAsync(result.auth_token);
      expect(decoded.email).toBe(userDto.email);
      expect(decoded.sub).toBe(userDto.id);
    });
  });
});
