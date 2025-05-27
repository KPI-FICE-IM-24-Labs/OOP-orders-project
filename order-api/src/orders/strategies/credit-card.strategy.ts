import { PaymentStrategy } from './payment-strategy.interface';

export class CreditCardPayment implements PaymentStrategy {
  pay(amount: number): string {
    return `Paid $${amount.toFixed(2)} using Credit Card`;
  }
}
