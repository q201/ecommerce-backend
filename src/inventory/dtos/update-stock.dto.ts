import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { MovementType, MovementReason } from '../entities/stock-movement.entity';

export class UpdateStockDto {
  @ApiProperty({ description: 'Quantity to adjust' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Type of movement', enum: MovementType })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ description: 'Reason for movement', enum: MovementReason })
  @IsEnum(MovementReason)
  reason: MovementReason;

  @ApiProperty({ description: 'Unit cost', required: false })
  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @ApiProperty({ description: 'Reference number or ID', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'User performing the action', required: false })
  @IsOptional()
  @IsString()
  performedBy?: string;
} 