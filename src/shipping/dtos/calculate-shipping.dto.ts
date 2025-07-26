import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ description: 'Country' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'State/Province' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Postal code' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: 'Street address', required: false })
  @IsOptional()
  @IsString()
  streetAddress?: string;
}

export class CartItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Weight in kg', required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ description: 'Price per unit' })
  @IsNumber()
  price: number;
}

export class CalculateShippingDto {
  @ApiProperty({ description: 'Shipping address' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ description: 'Cart items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ description: 'Order total', required: false })
  @IsOptional()
  @IsNumber()
  orderTotal?: number;

  @ApiProperty({ description: 'Preferred delivery date', required: false })
  @IsOptional()
  @IsString()
  preferredDeliveryDate?: string;

  @ApiProperty({ description: 'Special instructions', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
} 