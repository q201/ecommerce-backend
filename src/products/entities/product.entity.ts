import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { Review } from './review.entity';
import { Variant } from './variant.entity';
<<<<<<< HEAD
import { Inventory } from '../../inventory/entities/inventory.entity';
=======
import { Inventory } from '../../inventory/entities/inventory.entity'; // adjust path as needed
>>>>>>> master

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column("text")
  description: string;

  @Column("decimal")
  price: number;

  @Column("decimal", { nullable: true })
  discountPrice: number;

  @Column({ default: "INR" })
  currency: string;

  @Column()
  sku: string;

  // Removed `stock` field to avoid duplication

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  brand: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true, eager: true })
  images: ProductImage[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Variant, (variant) => variant.product, { cascade: true })
  variants: Variant[];

<<<<<<< HEAD
  @OneToMany(() => Inventory, (inventory) => inventory.product)
=======
  @OneToMany(() => Inventory, inventory => inventory.product)
>>>>>>> master
  inventories: Inventory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
