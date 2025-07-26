import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class AddItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiProperty({ description: 'Notes about the item', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Priority level (1-5)', minimum: 1, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;

  @ApiProperty({ description: 'Is this a gift item', default: false })
  @IsOptional()
  @IsBoolean()
  isGift?: boolean;

  @ApiProperty({ description: 'Gift message', required: false })
  @IsOptional()
  @IsString()
  giftMessage?: string;

  @ApiProperty({ description: 'Product variant information', required: false })
  @IsOptional()
  productVariant?: any;
} 