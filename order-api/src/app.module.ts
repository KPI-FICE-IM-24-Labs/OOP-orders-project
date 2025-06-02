import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { KafkaModule } from './kafka/kafka.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        HOST: Joi.string().hostname().optional().default('localhost'),
        PORT: Joi.number().port().required(),
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    AuthModule,
    DatabaseModule,
    OrdersModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
