import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/createOrder.dto';

@Injectable()
export class OrdersService {
  // eslint-disable-next-line
  public async createOrder(dto: CreateOrderDto, userId: string) {
    throw new NotImplementedException();
  }
}
