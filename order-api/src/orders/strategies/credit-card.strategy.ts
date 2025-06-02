import { PaymentStrategy } from './payment-strategy.interface';

export class CreditCardStrategy implements PaymentStrategy {
  public pay(amount: number, balance: number) {
    if (amount > balance) {
      return { success: false, message: 'Insufficient balance' };
    }
    return { success: true, message: 'Payment succeeded' };
  }
}
