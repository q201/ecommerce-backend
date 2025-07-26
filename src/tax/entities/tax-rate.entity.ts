import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TaxType {
  SALES_TAX = 'SALES_TAX',
  VAT = 'VAT',
  GST = 'GST',
  HST = 'HST',
  PST = 'PST',
  IMPORT_DUTY = 'IMPORT_DUTY',
  EXCISE_TAX = 'EXCISE_TAX',
  DIGITAL_TAX = 'DIGITAL_TAX',
}

export enum TaxCalculationType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  COMPOUND = 'COMPOUND',
}

@Entity()
export class TaxRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: TaxType,
  })
  type: TaxType;

  @Column({
    type: 'enum',
    enum: TaxCalculationType,
    default: TaxCalculationType.PERCENTAGE,
  })
  calculationType: TaxCalculationType;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  rate: number; // Percentage as decimal (e.g., 0.085 for 8.5%)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fixedAmount: number;

  @Column()
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minimumAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumAmount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isCompound: boolean;

  @Column({ type: 'boolean', default: false })
  isShippingTaxable: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 