import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderFactory } from './order.factory';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderFactory],
})
export class OrdersModule {}
