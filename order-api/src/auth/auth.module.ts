import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { UserModel } from '../database/models/user.model';
import { UserRepository } from './users/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import * as Joi from 'joi';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().alphanum().required(),
      }),
    }),
    DatabaseModule.forFeature([UserModel]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.getOrThrow<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: config.getOrThrow<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    AuthService,
    UserRepository,
    UsersService,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
