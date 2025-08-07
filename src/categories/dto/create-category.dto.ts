import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Category slug', example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Category description', example: 'Electronic devices and gadgets', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}