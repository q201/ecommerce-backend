import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ExemptionType {
  CUSTOMER = 'CUSTOMER',
  PRODUCT = 'PRODUCT',
  ORGANIZATION = 'ORGANIZATION',
  GOVERNMENT = 'GOVERNMENT',
  NON_PROFIT = 'NON_PROFIT',
  EDUCATIONAL = 'EDUCATIONAL',
  MEDICAL = 'MEDICAL',
  DIPLOMATIC = 'DIPLOMATIC',
}

export enum ExemptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

@Entity()
export class TaxExemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ unique: true })
  certificateNumber: string;

  @Column({
    type: 'enum',
    enum: ExemptionType,
  })
  type: ExemptionType;

  @Column({
    type: 'enum',
    enum: ExemptionStatus,
    default: ExemptionStatus.PENDING,
  })
  status: ExemptionStatus;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json' })
  applicableTaxes: string[];

  @Column({ type: 'json', nullable: true })
  applicableProducts: string[];

  @Column({ type: 'json', nullable: true })
  applicableCategories: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumAmount: number;

  @Column({ type: 'date' })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validTo: Date;

  @Column({ type: 'text', nullable: true })
  certificateDocument: string;

  @Column({ type: 'text', nullable: true })
  supportingDocuments: string[];

  @Column({ type: 'text', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 