import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReturnItem } from './return-item.entity';
import { Refund } from './refund.entity';

export enum ReturnStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  PROCESSED = 'PROCESSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ReturnType {
  REFUND = 'REFUND',
  EXCHANGE = 'EXCHANGE',
  REPLACEMENT = 'REPLACEMENT',
  STORE_CREDIT = 'STORE_CREDIT',
}

@Entity()
export class Return {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @Column({ unique: true })
  returnNumber: string;

  @Column({
    type: 'enum',
    enum: ReturnStatus,
    default: ReturnStatus.PENDING,
  })
  status: ReturnStatus;

  @Column({
    type: 'enum',
    enum: ReturnType,
  })
  type: ReturnType;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  restockingFee: number;

  @Column({ type: 'boolean', default: false })
  isPartialReturn: boolean;

  @Column({ type: 'boolean', default: false })
  requiresShipping: boolean;

  @Column({ type: 'text', nullable: true })
  shippingLabel: string;

  @Column({ type: 'text', nullable: true })
  trackingNumber: string;

  @Column({ type: 'text', nullable: true })
  returnAddress: string;

  @Column({ type: 'date', nullable: true })
  expectedReturnDate: Date;

  @Column({ type: 'date', nullable: true })
  actualReturnDate: Date;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ type: 'text', nullable: true })
  customerNotes: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ReturnItem, item => item.return)
  items: ReturnItem[];

  @OneToMany(() => Refund, refund => refund.return)
  refunds: Refund[];
} 