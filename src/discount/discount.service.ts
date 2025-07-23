
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
  ) {}

  async create(discountData: Partial<Discount>): Promise<Discount> {
    const discount = this.discountRepository.create(discountData);
    return this.discountRepository.save(discount);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.find();
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new Error('Discount not found');
    }
    return discount;
  }

  async update(id: string, updateData: Partial<Discount>): Promise<Discount> {
    await this.discountRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.discountRepository.delete(id);
  }
}
