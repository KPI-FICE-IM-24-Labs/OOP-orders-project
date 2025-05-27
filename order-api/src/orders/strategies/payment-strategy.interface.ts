import { UserDto } from '../../auth/dto/user.dto';
import { Order } from '../entities/order.entity';

export interface PaymentStrategy {
  canPay(user: UserDto, order: Order): boolean;
}
