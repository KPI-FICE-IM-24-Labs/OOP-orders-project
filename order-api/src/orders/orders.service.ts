import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderFactory } from './order.factory';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStrategy } from './strategies/payment-strategy.interface';
import { CreditCardStrategy } from './strategies/credit-card.strategy';
import { PayPalStrategy } from './strategies/payPalStrategy';
import { PaymentContext } from './strategies/payment.context';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersFactory: OrderFactory) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  public async createOrder(dto: CreateOrderDto, userId: string) {
    const order = this.ordersFactory.create({ items: dto.items, userId });
    const paymentStrategy = this.resolveStrategy(dto.paymentMethod);
    const paymentContext = new PaymentContext(paymentStrategy);

    const payment = paymentContext.executePayment(
      order.totalAmount,
      dto.paymentBalance,
    );

    if (!payment.success) {
      order.setStatus(OrderStatus.FAILED);
      throw new HttpException(payment.message, HttpStatus.PAYMENT_REQUIRED);
    }

    order.setStatus(OrderStatus.CONFIRMED);
    return order;
  }

  private resolveStrategy(paymentMethod: PaymentMethod) {
    const strategies: Record<PaymentMethod, PaymentStrategy> = {
      credit_card: new CreditCardStrategy(),
      paypal: new PayPalStrategy(),
    };

    return strategies[paymentMethod];
  }
}
