import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  customerId: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ default: 'pending' })
  status?: string;
}
