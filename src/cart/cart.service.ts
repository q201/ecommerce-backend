import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(cartData: Partial<Cart>): Promise<Cart> {
    const cart = this.cartRepository.create(cartData);
    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['items'] });
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id }, relations: ['items'] });
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  async update(id: string, updateData: Partial<Cart>): Promise<Cart> {
    await this.cartRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.cartRepository.delete(id);
  }
}
