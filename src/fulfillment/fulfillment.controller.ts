import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FulfillmentService } from './fulfillment.service';
import { Fulfillment } from './entities/fulfillment.entity';

@ApiTags('fulfillment')
@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fulfillment' })
  async create(@Body() fulfillmentData: Partial<Fulfillment>) {
    try {
      const fulfillment = await this.fulfillmentService.create(fulfillmentData);
      return fulfillment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all fulfillments' })
  async findAll() {
    return this.fulfillmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fulfillment by ID' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.fulfillmentService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fulfillment by ID' })
  async update(@Param('id') id: string, @Body() updateData: Partial<Fulfillment>) {
    try {
      return await this.fulfillmentService.update(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete fulfillment by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.fulfillmentService.remove(id);
      return { message: 'Fulfillment deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
