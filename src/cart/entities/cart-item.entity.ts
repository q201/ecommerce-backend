import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Column('int')
  quantity: number;

  @Column('decimal')
  unit_price: number;

  @ManyToOne(() => Cart, cart => cart.items)
  cart: Cart;
}
