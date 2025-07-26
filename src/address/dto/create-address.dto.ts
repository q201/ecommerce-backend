import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: '123 Main St', description: 'The street address' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Anytown', description: 'The city' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'CA', description: 'The state or province' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '12345', description: 'The zip or postal code' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ example: 'USA', description: 'The country' })
  @IsString()
  @IsNotEmpty()
  country: string;
}