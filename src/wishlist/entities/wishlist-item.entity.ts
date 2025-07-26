import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Wishlist } from './wishlist.entity';

@Entity()
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  wishlistId: string;

  @Column()
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentPrice: number;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: false })
  isOnSale: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 0 })
  priority: number; // 1-5, 5 being highest priority

  @Column({ type: 'boolean', default: false })
  isGift: boolean;

  @Column({ type: 'text', nullable: true })
  giftMessage: string;

  @Column({ type: 'json', nullable: true })
  productVariant: any; // Store variant information

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Wishlist, wishlist => wishlist.items)
  wishlist: Wishlist;
} 