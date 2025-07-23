import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  discountPrice?: number;

  @ApiProperty({ default: 'INR' })
  currency?: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  stock: number;

  @ApiProperty({ default: true })
  isActive?: boolean;

  @ApiProperty({ required: false })
  brand?: string;
}
