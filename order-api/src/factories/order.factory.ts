import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../orders/dto/createOrder.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class OrderFactory {
  create(dto: CreateOrderDto): Order {
    const order = new Order();
    order.userId = dto.userId;
    order.items = dto.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: 0, // Це може бути встановлено окремо при обробці
    }));
    order.status = 'PENDING';
    order.createdAt = new Date();
    return order;
  }
}