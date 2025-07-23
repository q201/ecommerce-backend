import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ default: 'user' })
  role: string;
}
