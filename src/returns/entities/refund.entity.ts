import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Return } from './return.entity';

export enum RefundStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum RefundMethod {
  ORIGINAL_PAYMENT = 'ORIGINAL_PAYMENT',
  STORE_CREDIT = 'STORE_CREDIT',
  GIFT_CARD = 'GIFT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
}

export enum RefundType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  RESTOCKING_FEE = 'RESTOCKING_FEE',
  SHIPPING = 'SHIPPING',
}

@Entity()
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  returnId: string;

  @Column({ unique: true })
  refundNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: RefundStatus,
    default: RefundStatus.PENDING,
  })
  status: RefundStatus;

  @Column({
    type: 'enum',
    enum: RefundMethod,
  })
  method: RefundMethod;

  @Column({
    type: 'enum',
    enum: RefundType,
  })
  type: RefundType;

  @Column({ nullable: true })
  originalPaymentId: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date', nullable: true })
  processedAt: Date;

  @Column({ type: 'date', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'json', nullable: true })
  paymentDetails: any;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'boolean', default: false })
  isAutomatic: boolean;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Return, returnRequest => returnRequest.refunds)
  return: Return;
} 