import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Rating (1-5 stars)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Review content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Review images', required: false })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({ description: 'Review videos', required: false })
  @IsOptional()
  @IsArray()
  videos?: string[];

  @ApiProperty({ description: 'Pros list', required: false })
  @IsOptional()
  @IsArray()
  pros?: string[];

  @ApiProperty({ description: 'Cons list', required: false })
  @IsOptional()
  @IsArray()
  cons?: string[];

  @ApiProperty({ description: 'Review tags', required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ description: 'Is anonymous review', default: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
} 