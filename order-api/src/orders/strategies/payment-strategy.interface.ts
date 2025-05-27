export interface PaymentStrategy {
  pay(amount: number): string;
}