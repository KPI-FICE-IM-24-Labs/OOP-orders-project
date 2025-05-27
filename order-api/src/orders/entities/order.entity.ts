export class OrderItem {
  productId!: string;
  quantity!: number;
  unitPrice!: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export class Order {
  id?: string;
  userId!: string;
  items!: OrderItem[];
  status!: OrderStatus;
  createdAt!: Date;
}
