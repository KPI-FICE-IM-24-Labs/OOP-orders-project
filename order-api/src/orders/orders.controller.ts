import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  public async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.service.createOrder(dto, userId);
  }
}
