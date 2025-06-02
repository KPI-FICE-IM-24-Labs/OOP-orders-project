import { IOrderItem } from '../orders/dto/order-item.dto';

export interface KafkaPayload {
  orderId: string;
  userId: string;
  items: IOrderItem[];
  timestamp: string;
}
