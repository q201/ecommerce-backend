import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderAddress } from './order-address.entity';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  currency_code: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  billing_address_id: string;

  @Column({ nullable: true })
  shipping_address_id: string;

  @Column({ nullable: true })
  payment_status: string;

  @Column({ nullable: true })
  fulfillment_status: string;

  @Column('decimal', { nullable: true })
  discount_total: number;

  @Column('decimal', { nullable: true })
  shipping_total: number;

  @Column('decimal', { nullable: true })
  tax_total: number;

  @Column('decimal', { nullable: true })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @ManyToOne(() => OrderAddress)
  @JoinColumn({ name: 'billing_address_id' })
  billing_address: OrderAddress;

  @ManyToOne(() => OrderAddress)
  @JoinColumn({ name: 'shipping_address_id' })
  shipping_address: OrderAddress;

  @ManyToOne(() => User)
  customer: User;

  // @OneToMany(() => Discount, discount => discount.order)
  // discounts: Discount[];

  // @OneToMany(() => Payment, payment => payment.order)
  // payments: Payment[];

  // @OneToMany(() => ShippingMethod, shippingMethod => shippingMethod.order)
  // shipping_methods: ShippingMethod[];
}
