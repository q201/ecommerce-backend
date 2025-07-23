import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Column('int')
  quantity: number;

  @Column('decimal')
  unit_price: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;
}
