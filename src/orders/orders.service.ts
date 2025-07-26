import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, status, ...orderData } = createOrderDto;

    const newOrder = this.ordersRepository.create({ 
      ...orderData, 
      status: status ? status as OrderStatus : OrderStatus.PENDING,
      customer: { id: createOrderDto.customerId } 
    });
    const savedOrder = await this.ordersRepository.save(newOrder);

    if (items && items.length > 0) {
      const orderItems: OrderItem[] = [];
      let totalOrderPrice = 0;

      for (const itemDto of items) {
        const product = await this.productsService.findOne(itemDto.product_id);
        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.product_id} not found.`);
        }

        const orderItem = this.orderItemsRepository.create({
          product: product,
          quantity: itemDto.quantity,
          unit_price: product.price, // Assuming product price is the unit price for the order item
          order: savedOrder,
        });
        orderItems.push(orderItem);
        totalOrderPrice += product.price * itemDto.quantity;
      }
      await this.orderItemsRepository.save(orderItems);
    }
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
}
