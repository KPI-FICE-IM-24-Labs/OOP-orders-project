import { PaymentStrategy } from './payment-strategy.interface';

export class PaypalPayment implements PaymentStrategy {
  pay(amount: number): string {
    return `Paid $${amount.toFixed(2)} via PayPal`;
  }
}
