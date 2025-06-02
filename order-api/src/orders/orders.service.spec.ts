import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { describe } from 'node:test';
import { OrdersModule } from './orders.module';
import { OrderFactory } from './order.factory';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentContext } from './strategies/payment.context';
import { CreditCardStrategy } from './strategies/credit-card.strategy';
import { PayPalStrategy } from './strategies/payPalStrategy';

void describe('OrdersModule', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrdersModule],
      providers: [OrdersService, OrderFactory],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  void describe('OrdersFactory', () => {
    it('should create order with correct attributes', () => {
      const factory = new OrderFactory();
      const order = factory.create({
        userId: 'someid',
        items: [
          { unitPrice: 13, quantity: 3, productId: 'someid' },
          { unitPrice: 1, quantity: 2, productId: 'someid2' },
        ],
      });

      expect(order.totalAmount).toEqual(41);
      expect(order.items).toHaveLength(2);
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
      expect(order.getStatus()).toEqual(OrderStatus.PENDING);
    });
  });

  void describe('PaymentStrategy', () => {
    let creditCardStrategy: CreditCardStrategy;
    let paypalStrategy: PayPalStrategy;
    let context: PaymentContext;

    beforeEach(() => {
      creditCardStrategy = new CreditCardStrategy();
      paypalStrategy = new PayPalStrategy();
      context = new PaymentContext(creditCardStrategy);
    });

    it('should initialize with CreditCardStrategy', () => {
      expect(context.getStrategy()).toBeInstanceOf(CreditCardStrategy);
    });

    it('should switch to PayPalStrategy and process payment correctly', () => {
      context.setStrategy(paypalStrategy);
      expect(context.getStrategy()).toBeInstanceOf(PayPalStrategy);
      expect(context.executePayment(100, 500).success).toBeTruthy(); // balance covers 100 + 2 fee
      expect(context.executePayment(100, 10).success).toBeFalsy(); // insufficient balance
      expect(context.executePayment(100, 100).success).toBeFalsy(); // exactly 100, but not enough for 102
    });

    it('should revert to CreditCardStrategy and succeed if balance equals amount', () => {
      context.setStrategy(creditCardStrategy);
      expect(context.executePayment(100, 100).success).toBeTruthy();
      expect(context.executePayment(100, 500).success).toBeTruthy();
      expect(context.executePayment(100, 10).success).toBeFalsy();
    });
  });
});
