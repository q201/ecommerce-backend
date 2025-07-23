import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from './product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int")
  rating: number; // 1 to 5 stars

  @Column("text")
  comment: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
