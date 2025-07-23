import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: string; // e.g., "Color", "Size"

  @Column()
  value: string; // e.g., "Red", "XL"

  @Column("decimal")
  priceAdjustment: number; // +100 or -50

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;
}
