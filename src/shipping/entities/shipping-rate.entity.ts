import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShippingMethod } from './shipping-method.entity';

@Entity()
export class ShippingRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shippingMethodId: string;

  @Column()
  zoneId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  rate: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, default: 0 })
  minWeight: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, default: 0 })
  maxWeight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  maxOrderValue: number;

  @Column({ type: 'int', default: 0 })
  minDeliveryDays: number;

  @Column({ type: 'int', default: 0 })
  maxDeliveryDays: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFree: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  additionalFee: number;

  @Column({ type: 'json', nullable: true })
  conditions: any;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ShippingMethod, method => method.rates)
  shippingMethod: ShippingMethod;
} 