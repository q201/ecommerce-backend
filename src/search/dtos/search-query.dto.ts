import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsObject, Min, Max } from 'class-validator';
import { SearchType } from '../entities/search-log.entity';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query string' })
  @IsString()
  query: string;

  @ApiProperty({ description: 'Search type', enum: SearchType, required: false })
  @IsOptional()
  type?: SearchType;

  @ApiProperty({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Items per page', default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ description: 'Sort field', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', enum: ['asc', 'desc'], required: false })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({ description: 'Price range filter', required: false })
  @IsOptional()
  @IsObject()
  priceRange?: {
    min?: number;
    max?: number;
  };

  @ApiProperty({ description: 'Category filter', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Brand filter', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Rating filter', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @ApiProperty({ description: 'Availability filter', required: false })
  @IsOptional()
  @IsString()
  availability?: 'in_stock' | 'out_of_stock' | 'pre_order';

  @ApiProperty({ description: 'Additional filters', required: false })
  @IsOptional()
  @IsObject()
  filters?: any;
} 