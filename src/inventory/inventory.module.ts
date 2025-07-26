import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { Inventory } from './entities/inventory.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, StockMovement, Warehouse])],
  controllers: [InventoryController, WarehouseController],
  providers: [InventoryService, WarehouseService],
  exports: [InventoryService, WarehouseService],
})
export class InventoryModule {} 