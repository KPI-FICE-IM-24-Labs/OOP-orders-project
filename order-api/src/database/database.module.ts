import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UserModel } from './models/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().hostname().required(),
        POSTGRES_PORT: Joi.number().port().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: Number(configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        models: [UserModel],
        autoLoadModels: true,
        sync: { alter: true, force: false },
        logging: (msg) => Logger.log(msg, SequelizeModule.name),
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entities: any[]) {
    return SequelizeModule.forFeature(entities);
  }
}
