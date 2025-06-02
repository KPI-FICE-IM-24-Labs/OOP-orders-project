import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaPayload } from '../types/kafka.payload';
import { IOrder } from './dto/order.entity';

@Injectable()
export class ProcessOrderCommand {
  constructor(private readonly kafka: KafkaService) {}

  public async execute(order: IOrder) {
    const payload: KafkaPayload = {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      timestamp: new Date().toISOString(),
    };

    await this.kafka.send('order-created', payload);
    return { message: 'Order created', orderId: order.id };
  }
}
