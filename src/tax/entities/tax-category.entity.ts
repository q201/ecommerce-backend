import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TaxCategoryType {
  GENERAL = 'GENERAL',
  FOOD = 'FOOD',
  CLOTHING = 'CLOTHING',
  BOOKS = 'BOOKS',
  MEDICAL = 'MEDICAL',
  DIGITAL = 'DIGITAL',
  SERVICES = 'SERVICES',
  LUXURY = 'LUXURY',
  ESSENTIAL = 'ESSENTIAL',
  EXEMPT = 'EXEMPT',
}

@Entity()
export class TaxCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: TaxCategoryType,
    default: TaxCategoryType.GENERAL,
  })
  type: TaxCategoryType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0 })
  defaultRate: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isExempt: boolean;

  @Column({ type: 'json', nullable: true })
  applicableCountries: string[];

  @Column({ type: 'json', nullable: true })
  applicableStates: string[];

  @Column({ type: 'json', nullable: true })
  productTypes: string[];

  @Column({ type: 'json', nullable: true })
  hsnCodes: string[];

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 