import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Warehouse } from './entities/warehouse.entity';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { UpdateStockDto } from './dtos/update-stock.dto';
import { MovementType, MovementReason } from './entities/stock-movement.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(createInventoryDto);
    inventory.availableStock = inventory.currentStock - inventory.reservedStock;
    inventory.totalValue = inventory.currentStock * (inventory.unitCost || 0);
    
    return await this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      relations: ['product', 'warehouse'],
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse', 'stockMovements'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async findByProduct(productId: string): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      where: { productId },
      relations: ['warehouse'],
    });
  }

  async findByWarehouse(warehouseId: string): Promise<Inventory[]> {
    return await this.inventoryRepository.find({
      where: { warehouseId },
      relations: ['product'],
    });
  }

  async updateStock(id: string, updateStockDto: UpdateStockDto): Promise<Inventory> {
    const inventory = await this.findOne(id);
    const previousStock = inventory.currentStock;
    const previousReserved = inventory.reservedStock;

    // Calculate new stock based on movement type
    switch (updateStockDto.type) {
      case MovementType.IN:
        inventory.currentStock += updateStockDto.quantity;
        break;
      case MovementType.OUT:
        if (inventory.currentStock < updateStockDto.quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        inventory.currentStock -= updateStockDto.quantity;
        break;
      case MovementType.ADJUSTMENT:
        inventory.currentStock = updateStockDto.quantity;
        break;
      case MovementType.RESERVED:
        if (inventory.availableStock < updateStockDto.quantity) {
          throw new BadRequestException('Insufficient available stock');
        }
        inventory.reservedStock += updateStockDto.quantity;
        break;
      case MovementType.RELEASED:
        if (inventory.reservedStock < updateStockDto.quantity) {
          throw new BadRequestException('Insufficient reserved stock');
        }
        inventory.reservedStock -= updateStockDto.quantity;
        break;
    }

    // Update calculated fields
    inventory.availableStock = inventory.currentStock - inventory.reservedStock;
    inventory.totalValue = inventory.currentStock * (inventory.unitCost || 0);

    // Create stock movement record
    const movement = this.stockMovementRepository.create({
      inventoryId: id,
      type: updateStockDto.type,
      reason: updateStockDto.reason,
      quantity: updateStockDto.quantity,
      previousStock: previousStock,
      newStock: inventory.currentStock,
      unitCost: updateStockDto.unitCost,
      totalValue: updateStockDto.quantity * (updateStockDto.unitCost || 0),
      reference: updateStockDto.reference,
      notes: updateStockDto.notes,
      performedBy: updateStockDto.performedBy,
    });

    await this.stockMovementRepository.save(movement);
    return await this.inventoryRepository.save(inventory);
  }

  async getLowStockItems(threshold?: number): Promise<Inventory[]> {
    const minThreshold = threshold || 10;
    return await this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.currentStock <= :threshold', { threshold: minThreshold })
      .andWhere('inventory.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async getStockMovements(inventoryId: string): Promise<StockMovement[]> {
    return await this.stockMovementRepository.find({
      where: { inventoryId },
      order: { createdAt: 'DESC' },
    });
  }

  async getInventoryValue(): Promise<{ totalValue: number; itemCount: number }> {
    const result = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.totalValue)', 'totalValue')
      .addSelect('COUNT(inventory.id)', 'itemCount')
      .where('inventory.isActive = :isActive', { isActive: true })
      .getRawOne();

    return {
      totalValue: parseFloat(result.totalValue) || 0,
      itemCount: parseInt(result.itemCount) || 0,
    };
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOne(id);
    await this.inventoryRepository.remove(inventory);
  }
} 