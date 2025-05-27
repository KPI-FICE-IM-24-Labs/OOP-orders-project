import { PaymentStrategy } from './payment-strategy.interface';

export class PaymentContext {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  public executePayment(amount: number): string {
    return this.strategy.pay(amount);
  }
}
