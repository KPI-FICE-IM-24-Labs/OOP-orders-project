import { v7 as uuidv7 } from 'uuid';
import { OrderStatus } from '../enums/order-status.enum';
import { IOrderItem } from './order-item.dto';

export interface IOrder {
  id: string;
  userId: string;
  totalAmount: number;
  items: IOrderItem[];
  createdAt: Date;
  getStatus: () => OrderStatus;
  setStatus: (value: OrderStatus) => void;
}

export class Order implements IOrder {
  public readonly id: string;
  public readonly totalAmount: number;
  public readonly createdAt: Date;
  private _status: OrderStatus;

  constructor(
    public readonly userId: string,
    public readonly items: IOrderItem[],
    status: OrderStatus,
  ) {
    this.id = uuidv7();
    this.totalAmount = this.calculateTotalAmount();
    this.createdAt = new Date();
    this._status = status;
  }

  public getStatus(): OrderStatus {
    return this._status;
  }

  public setStatus(value: OrderStatus): void {
    this._status = value;
  }

  private calculateTotalAmount(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
  }
}
