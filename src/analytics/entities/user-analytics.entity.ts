import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  pageViews: number;

  @Column({ type: 'int', default: 0 })
  sessions: number;

  @Column({ type: 'int', default: 0 })
  uniqueVisits: number;

  @Column({ type: 'int', default: 0 })
  productsViewed: number;

  @Column({ type: 'int', default: 0 })
  productsAddedToCart: number;

  @Column({ type: 'int', default: 0 })
  ordersPlaced: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ type: 'int', default: 0 })
  timeOnSite: number; // in seconds

  @Column({ type: 'int', default: 0 })
  bounceRate: number; // percentage

  @Column({ type: 'json', nullable: true })
  pagesVisited: string[];

  @Column({ type: 'json', nullable: true })
  productsInteracted: any[];

  @Column({ type: 'json', nullable: true })
  searchQueries: string[];

  @Column({ type: 'json', nullable: true })
  deviceInfo: any;

  @Column({ type: 'json', nullable: true })
  locationInfo: any;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'text', nullable: true })
  referrer: string;

  @Column({ type: 'boolean', default: false })
  isNewUser: boolean;

  @Column({ type: 'boolean', default: false })
  isReturningUser: boolean;

  @Column({ type: 'json', nullable: true })
  conversionEvents: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 