export interface PaymentStrategy {
  pay(amount: number, balance: number): { success: boolean; message: string };
}
