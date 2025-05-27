import { Injectable } from '@nestjs/common';
import { OrderFactory } from '../factories/order.factory';
import { PaymentContext } from './strategies/payment.context';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UserDto } from '../auth/dto/user.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderFactory: OrderFactory,
    private readonly paymentContext: PaymentContext,
  ) {}

  createOrder(dto: CreateOrderDto, user: UserDto): Order {
    const order = this.orderFactory.create(dto);

    const canPay = this.paymentContext.execute(user, order);
    if (!canPay) {
      throw new Error('Insufficient balance');
    }

    // TODO: persist order and send to Kafka
    return order;
  }
}
