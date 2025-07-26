import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty()
  product_id: string;

  @ApiProperty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  customerId: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ default: 'pending' })
  status?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  items?: CreateOrderItemDto[];
}
