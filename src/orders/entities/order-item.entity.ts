import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { eager: true }) // Eager load product details for convenience
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  unit_price: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;
}
