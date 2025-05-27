import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderFactory } from '../factories/order.factory';
import { PaymentContext } from './strategies/payment.context';
import { PaypalStrategy } from './strategies/paypal.strategy';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderFactory,
    PaymentContext,
    PaypalStrategy,
  ],
})
export class OrdersModule {}
