import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItemDto implements IOrderItem {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  unitPrice!: number;
}
