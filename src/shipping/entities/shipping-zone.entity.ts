import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ShippingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json' })
  countries: string[];

  @Column({ type: 'json', nullable: true })
  states: string[];

  @Column({ type: 'json', nullable: true })
  cities: string[];

  @Column({ type: 'json', nullable: true })
  postalCodes: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  baseShippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  freeShippingThreshold: number;

  @Column({ type: 'int', default: 0 })
  estimatedDeliveryDays: number;

  @Column({ type: 'json', nullable: true })
  restrictions: any;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 