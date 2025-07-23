import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  customer_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  region_id: string;

  @Column({ nullable: true })
  currency_code: string;

  @Column('decimal', { nullable: true })
  tax_total: number;

  @Column('decimal', { nullable: true })
  shipping_total: number;

  @Column('decimal', { nullable: true })
  discount_total: number;

  @Column('decimal', { nullable: true })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CartItem, item => item.cart)
  items: CartItem[];
}
