import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  async create(@Body() cartData: Partial<Cart>) {
    try {
      const cart = await this.cartService.create(cartData);
      return cart;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  async findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.cartService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cart by ID' })
  async update(@Param('id') id: string, @Body() updateData: Partial<Cart>) {
    try {
      return await this.cartService.update(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete cart by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.cartService.remove(id);
      return { message: 'Cart deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
