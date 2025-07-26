import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReasonCategory {
  PRODUCT_ISSUE = 'PRODUCT_ISSUE',
  CUSTOMER_CHANGE = 'CUSTOMER_CHANGE',
  SHIPPING_ISSUE = 'SHIPPING_ISSUE',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  SIZE_FIT = 'SIZE_FIT',
  DAMAGED = 'DAMAGED',
  WRONG_ITEM = 'WRONG_ITEM',
  OTHER = 'OTHER',
}

@Entity()
export class ReturnReason {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: ReasonCategory,
  })
  category: ReasonCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ type: 'int', default: 0 })
  returnWindowDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  restockingFeePercentage: number;

  @Column({ type: 'boolean', default: true })
  allowsPartialReturn: boolean;

  @Column({ type: 'boolean', default: true })
  allowsExchange: boolean;

  @Column({ type: 'boolean', default: true })
  allowsRefund: boolean;

  @Column({ type: 'boolean', default: false })
  requiresOriginalPackaging: boolean;

  @Column({ type: 'boolean', default: false })
  requiresReceipt: boolean;

  @Column({ type: 'json', nullable: true })
  restrictions: any;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 