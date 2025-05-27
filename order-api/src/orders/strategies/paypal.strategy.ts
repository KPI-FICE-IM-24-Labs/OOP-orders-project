import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { UserDto } from '../../auth/dto/user.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class PaypalStrategy implements PaymentStrategy {
  canPay(user: UserDto, order: Order): boolean {
    const total = order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    return user.balance >= total;
  }
}