import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { UpdateStockDto } from './dtos/update-stock.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create new inventory record' })
  @ApiResponse({ status: 201, description: 'Inventory created successfully' })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory records' })
  @ApiResponse({ status: 200, description: 'List of all inventory records' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({ status: 200, description: 'List of low stock items' })
  getLowStockItems(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStockItems(threshold);
  }

  @Get('value')
  @ApiOperation({ summary: 'Get total inventory value' })
  @ApiResponse({ status: 200, description: 'Total inventory value and item count' })
  getInventoryValue() {
    return this.inventoryService.getInventoryValue();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get inventory by product ID' })
  @ApiResponse({ status: 200, description: 'Inventory records for the product' })
  findByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findByProduct(productId);
  }

  @Get('warehouse/:warehouseId')
  @ApiOperation({ summary: 'Get inventory by warehouse ID' })
  @ApiResponse({ status: 200, description: 'Inventory records for the warehouse' })
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.findByWarehouse(warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory by ID' })
  @ApiResponse({ status: 200, description: 'Inventory record found' })
  @ApiResponse({ status: 404, description: 'Inventory not found' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Get(':id/movements')
  @ApiOperation({ summary: 'Get stock movements for inventory' })
  @ApiResponse({ status: 200, description: 'List of stock movements' })
  getStockMovements(@Param('id') id: string) {
    return this.inventoryService.getStockMovements(id);
  }

  @Put(':id/stock')
  @ApiOperation({ summary: 'Update stock quantity' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid stock operation' })
  updateStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.inventoryService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory record' })
  @ApiResponse({ status: 200, description: 'Inventory deleted successfully' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
} 