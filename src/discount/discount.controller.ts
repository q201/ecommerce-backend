import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { Discount } from './entities/discount.entity';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discount' })
  async create(@Body() discountData: Partial<Discount>) {
    try {
      const discount = await this.discountService.create(discountData);
      return discount;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  async findAll() {
    return this.discountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by ID' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.discountService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update discount by ID' })
  async update(@Param('id') id: string, @Body() updateData: Partial<Discount>) {
    try {
      return await this.discountService.update(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete discount by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.discountService.remove(id);
      return { message: 'Discount deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
