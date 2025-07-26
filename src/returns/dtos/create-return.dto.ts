import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnType } from '../entities/return.entity';
import { ItemCondition } from '../entities/return-item.entity';

export class ReturnItemDto {
  @ApiProperty({ description: 'Order item ID' })
  @IsString()
  orderItemId: string;

  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Quantity to return' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Item condition', enum: ItemCondition })
  @IsEnum(ItemCondition)
  condition: ItemCondition;

  @ApiProperty({ description: 'Return reason for this item', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Additional description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Images of the item', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ description: 'Is item damaged', default: false })
  @IsOptional()
  isDamaged?: boolean;

  @ApiProperty({ description: 'Is original packaging included', default: true })
  @IsOptional()
  isOriginalPackaging?: boolean;
}

export class CreateReturnDto {
  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: 'Return type', enum: ReturnType })
  @IsEnum(ReturnType)
  type: ReturnType;

  @ApiProperty({ description: 'General return reason' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Additional description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Return items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];

  @ApiProperty({ description: 'Images of the return', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ description: 'Customer notes', required: false })
  @IsOptional()
  @IsString()
  customerNotes?: string;

  @ApiProperty({ description: 'Is urgent return', default: false })
  @IsOptional()
  isUrgent?: boolean;
} 