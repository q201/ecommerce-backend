import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsString()
  warehouseId: string;

  @ApiProperty({ description: 'Current stock quantity', default: 0 })
  @IsNumber()
  @Min(0)
  currentStock: number;

  @ApiProperty({ description: 'Reserved stock quantity', default: 0 })
  @IsNumber()
  @Min(0)
  reservedStock: number;

  @ApiProperty({ description: 'Minimum stock level', default: 0 })
  @IsNumber()
  @Min(0)
  minimumStock: number;

  @ApiProperty({ description: 'Maximum stock level', default: 0 })
  @IsNumber()
  @Min(0)
  maximumStock: number;

  @ApiProperty({ description: 'Unit cost', required: false })
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiProperty({ description: 'Is inventory active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
} 