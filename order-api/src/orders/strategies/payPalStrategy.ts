import { PaymentStrategy } from './payment-strategy.interface';

const PAYPAL_FEE = 0.029;

export class PayPalStrategy implements PaymentStrategy {
  public pay(amount: number, balance: number) {
    const fee = amount * PAYPAL_FEE;
    const totalCharge = amount + fee;

    if (totalCharge > balance) {
      return { success: false, message: 'Insufficient balance' };
    }
    return { success: true, message: 'Payment succeeded' };
  }
}
