import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RuleType {
  PRODUCT_BASED = 'PRODUCT_BASED',
  CUSTOMER_BASED = 'CUSTOMER_BASED',
  LOCATION_BASED = 'LOCATION_BASED',
  AMOUNT_BASED = 'AMOUNT_BASED',
  TIME_BASED = 'TIME_BASED',
  COMPOUND = 'COMPOUND',
}

export enum RuleOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_EQUAL = 'GREATER_EQUAL',
  LESS_EQUAL = 'LESS_EQUAL',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT_BETWEEN',
}

@Entity()
export class TaxRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: RuleType,
  })
  type: RuleType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  conditions: {
    field: string;
    operator: RuleOperator;
    value: any;
    value2?: any; // For BETWEEN operations
  }[];

  @Column({ type: 'json' })
  actions: {
    action: string;
    value: any;
    priority: number;
  }[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 