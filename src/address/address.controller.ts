import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Address } from './entities/address.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('address')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address for the authenticated user' })
  @ApiResponse({ status: 201, description: 'The address has been successfully created.', type: Address })
  create(@Body() createAddressDto: CreateAddressDto, @GetUser() user: User) {
    return this.addressService.create(createAddressDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all addresses for the user.', type: [Address] })
  findAll(@GetUser() user: User) {
    return this.addressService.findAllForUser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an address by ID for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return a single address.', type: Address })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.addressService.findOneForUser(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address for the authenticated user' })
  @ApiResponse({ status: 200, description: 'The address has been successfully updated.', type: Address })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() user: User,
  ) {
    return this.addressService.update(id, updateAddressDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an address for the authenticated user' })
  @ApiResponse({ status: 204, description: 'The address has been successfully deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    await this.addressService.remove(id, user);
  }
}