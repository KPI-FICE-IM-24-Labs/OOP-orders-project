import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        KAFKA_CLIENT_ID: Joi.string().required(),
        KAFKA_BROKER: Joi.string().uri().required(),
      }),
    }),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
