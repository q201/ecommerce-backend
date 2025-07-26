import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Return } from './return.entity';

export enum ItemCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  DAMAGED = 'DAMAGED',
}

@Entity()
export class ReturnItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  returnId: string;

  @Column()
  orderItemId: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({
    type: 'enum',
    enum: ItemCondition,
    default: ItemCondition.GOOD,
  })
  condition: ItemCondition;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'boolean', default: false })
  isDamaged: boolean;

  @Column({ type: 'boolean', default: false })
  isMissingParts: boolean;

  @Column({ type: 'boolean', default: false })
  isOriginalPackaging: boolean;

  @Column({ type: 'text', nullable: true })
  serialNumber: string;

  @Column({ type: 'text', nullable: true })
  sku: string;

  @Column({ type: 'json', nullable: true })
  productVariant: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  restockingFee: number;

  @Column({ type: 'boolean', default: true })
  isEligibleForReturn: boolean;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Return, returnRequest => returnRequest.items)
  return: Return;
} 