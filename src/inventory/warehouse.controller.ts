import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';

@ApiTags('warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create new warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created successfully' })
  create(@Body() createWarehouseDto: any) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  @ApiResponse({ status: 200, description: 'List of all warehouses' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default warehouse' })
  @ApiResponse({ status: 200, description: 'Default warehouse found' })
  getDefaultWarehouse() {
    return this.warehouseService.getDefaultWarehouse();
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get warehouse by code' })
  @ApiResponse({ status: 200, description: 'Warehouse found' })
  findByCode(@Param('code') code: string) {
    return this.warehouseService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiResponse({ status: 200, description: 'Warehouse found' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse updated successfully' })
  update(@Param('id') id: string, @Body() updateWarehouseDto: any) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Put(':id/set-default')
  @ApiOperation({ summary: 'Set warehouse as default' })
  @ApiResponse({ status: 200, description: 'Default warehouse set successfully' })
  setDefaultWarehouse(@Param('id') id: string) {
    return this.warehouseService.setDefaultWarehouse(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse deleted successfully' })
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(id);
  }
} 