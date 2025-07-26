import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { VendorType, VendorTier } from '../entities/vendor.entity';

export class SocialMediaDto {
  @ApiProperty({ description: 'Facebook URL', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ description: 'Twitter URL', required: false })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiProperty({ description: 'Instagram URL', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'LinkedIn URL', required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;
}

export class BusinessHoursDto {
  @ApiProperty({ description: 'Monday hours', required: false })
  @IsOptional()
  monday?: { open: string; close: string };

  @ApiProperty({ description: 'Tuesday hours', required: false })
  @IsOptional()
  tuesday?: { open: string; close: string };

  @ApiProperty({ description: 'Wednesday hours', required: false })
  @IsOptional()
  wednesday?: { open: string; close: string };

  @ApiProperty({ description: 'Thursday hours', required: false })
  @IsOptional()
  thursday?: { open: string; close: string };

  @ApiProperty({ description: 'Friday hours', required: false })
  @IsOptional()
  friday?: { open: string; close: string };

  @ApiProperty({ description: 'Saturday hours', required: false })
  @IsOptional()
  saturday?: { open: string; close: string };

  @ApiProperty({ description: 'Sunday hours', required: false })
  @IsOptional()
  sunday?: { open: string; close: string };
}

export class CreateVendorDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Business name' })
  @IsString()
  businessName: string;

  @ApiProperty({ description: 'Vendor type', enum: VendorType })
  @IsEnum(VendorType)
  type: VendorType;

  @ApiProperty({ description: 'Business description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Business website', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Business email' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Business phone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Business address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'State/Province', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Tax ID', required: false })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({ description: 'Business license', required: false })
  @IsOptional()
  @IsString()
  businessLicense?: string;

  @ApiProperty({ description: 'Commission rate percentage', minimum: 0, maximum: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @ApiProperty({ description: 'Minimum payout amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPayoutAmount?: number;

  @ApiProperty({ description: 'Social media links', required: false })
  @IsOptional()
  socialMedia?: SocialMediaDto;

  @ApiProperty({ description: 'Business hours', required: false })
  @IsOptional()
  businessHours?: BusinessHoursDto;

  @ApiProperty({ description: 'Product categories', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ description: 'Business tags', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
} 