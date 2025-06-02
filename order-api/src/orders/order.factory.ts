import { IOrder, Order } from './dto/order.entity';
import { IOrderItem } from './dto/order-item.dto';
import { OrderStatus } from './enums/order-status.enum';

interface CreateOrderParams {
  userId: string;
  items: IOrderItem[];
}

export class OrderFactory {
  public create(dto: CreateOrderParams): IOrder {
    return new Order(dto.userId, dto.items, OrderStatus.PENDING);
  }
}
