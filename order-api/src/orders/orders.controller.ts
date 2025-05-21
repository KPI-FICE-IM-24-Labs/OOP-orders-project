import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';

@UseGuards(JwtGuard)
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.service.createOrder(dto, userId);
  }
}
