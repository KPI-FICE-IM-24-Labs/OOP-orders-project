import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { UserDto } from '../../auth/dto/user.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class PaymentContext {
  constructor(private readonly strategy: PaymentStrategy) {}

  execute(user: UserDto, order: Order): boolean {
    return this.strategy.canPay(user, order);
  }
}