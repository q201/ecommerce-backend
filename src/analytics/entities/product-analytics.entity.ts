import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  uniqueViews: number;

  @Column({ type: 'int', default: 0 })
  addToCartCount: number;

  @Column({ type: 'int', default: 0 })
  purchases: number;

  @Column({ type: 'int', default: 0 })
  quantitySold: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  conversionRate: number; // purchases / views

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  addToCartRate: number; // addToCart / views

  @Column({ type: 'int', default: 0 })
  reviews: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  wishlistAdds: number;

  @Column({ type: 'int', default: 0 })
  shares: number;

  @Column({ type: 'json', nullable: true })
  viewsByHour: any[];

  @Column({ type: 'json', nullable: true })
  viewsByDay: any[];

  @Column({ type: 'json', nullable: true })
  viewsByRegion: any[];

  @Column({ type: 'json', nullable: true })
  viewsByDevice: any[];

  @Column({ type: 'json', nullable: true })
  viewsBySource: any[];

  @Column({ type: 'int', default: 0 })
  timeOnPage: number; // average time in seconds

  @Column({ type: 'int', default: 0 })
  bounceRate: number; // percentage

  @Column({ type: 'json', nullable: true })
  relatedProducts: string[];

  @Column({ type: 'json', nullable: true })
  searchKeywords: string[];

  @Column({ type: 'json', nullable: true })
  userSegments: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 