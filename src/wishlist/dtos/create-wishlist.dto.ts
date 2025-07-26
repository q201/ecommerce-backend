import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({ description: 'Wishlist name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Wishlist description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Is wishlist public', default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: 'Is default wishlist', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
} 