import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Fulfillment } from './entities/fulfillment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FulfillmentService {
  constructor(
    @InjectRepository(Fulfillment)
    private fulfillmentRepository: Repository<Fulfillment>,
  ) {}

  async create(fulfillmentData: Partial<Fulfillment>): Promise<Fulfillment> {
    const fulfillment = this.fulfillmentRepository.create(fulfillmentData);
    return this.fulfillmentRepository.save(fulfillment);
  }

  async findAll(): Promise<Fulfillment[]> {
    return this.fulfillmentRepository.find();
  }

  async findOne(id: string): Promise<Fulfillment> {
    const fulfillment = await this.fulfillmentRepository.findOne({ where: { id } });
    if (!fulfillment) {
      throw new Error('Fulfillment not found');
    }
    return fulfillment;
  }

  async update(id: string, updateData: Partial<Fulfillment>): Promise<Fulfillment> {
    await this.fulfillmentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.fulfillmentRepository.delete(id);
  }
}
