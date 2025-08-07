import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    // Check if warehouse code already exists
    if (Array.isArray(createWarehouseDto)) {
      throw new BadRequestException('Expected a single warehouse object, but received an array');
    }

    const existingWarehouse = await this.warehouseRepository.findOne({
      where: { code: createWarehouseDto.code },
    });

    if (existingWarehouse) {
      throw new BadRequestException('Warehouse code already exists');
    }

    const warehouse = this.warehouseRepository.create(createWarehouseDto);
    return await this.warehouseRepository.save(warehouse);
  }

  async findAll(): Promise<Warehouse[]> {
    return await this.warehouseRepository.find({
      relations: ['inventories'],
    });
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ['inventories'],
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse;
  }

  async findByCode(code: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { code },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with code ${code} not found`);
    }

    return warehouse;
  }

  async update(id: string, updateWarehouseDto: any): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    
    // If code is being updated, check for duplicates
    if (updateWarehouseDto.code && updateWarehouseDto.code !== warehouse.code) {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: { code: updateWarehouseDto.code },
      });

      if (existingWarehouse) {
        throw new BadRequestException('Warehouse code already exists');
      }
    }

    Object.assign(warehouse, updateWarehouseDto);
    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehouseRepository.remove(warehouse);
  }

  async getDefaultWarehouse(): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { isDefault: true },
    });

    if (!warehouse) {
      throw new NotFoundException('No default warehouse found');
    }

    return warehouse;
  }

  async setDefaultWarehouse(id: string): Promise<Warehouse> {
    // Remove default from all warehouses
    await this.warehouseRepository.update({}, { isDefault: false });
    
    // Set new default
    const warehouse = await this.findOne(id);
    warehouse.isDefault = true;
    return await this.warehouseRepository.save(warehouse);
  }
} 