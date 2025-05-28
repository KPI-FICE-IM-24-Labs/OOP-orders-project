import { PaymentStrategy } from './payment-strategy.interface';

export class PaymentContext {
  constructor(private strategy: PaymentStrategy) {}

  public executePayment(amount: number, balance: number) {
    return this.strategy.pay(amount, balance);
  }

  public setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  public getStrategy() {
    return this.strategy;
  }
}
