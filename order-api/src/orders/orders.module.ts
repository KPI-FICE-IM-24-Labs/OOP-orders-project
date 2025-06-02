import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderFactory } from './order.factory';
import { KafkaModule } from '../kafka/kafka.module';
import { ProcessOrderCommand } from './process-order.command';

@Module({
  imports: [KafkaModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrderFactory, ProcessOrderCommand],
})
export class OrdersModule {}
