import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShippingRate } from './shipping-rate.entity';

export enum ShippingMethodType {
  FLAT_RATE = 'FLAT_RATE',
  FREE_SHIPPING = 'FREE_SHIPPING',
  WEIGHT_BASED = 'WEIGHT_BASED',
  PRICE_BASED = 'PRICE_BASED',
  REAL_TIME = 'REAL_TIME',
  LOCAL_PICKUP = 'LOCAL_PICKUP',
}

export enum ShippingProvider {
  FEDEX = 'FEDEX',
  UPS = 'UPS',
  DHL = 'DHL',
  USPS = 'USPS',
  CUSTOM = 'CUSTOM',
  LOCAL = 'LOCAL',
}

@Entity()
export class ShippingMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: ShippingMethodType,
  })
  type: ShippingMethodType;

  @Column({
    type: 'enum',
    enum: ShippingProvider,
    nullable: true,
  })
  provider: ShippingProvider;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  baseCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  handlingFee: number;

  @Column({ type: 'int', default: 0 })
  minDeliveryDays: number;

  @Column({ type: 'int', default: 0 })
  maxDeliveryDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  maxOrderAmount: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, default: 0 })
  minWeight: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, default: 0 })
  maxWeight: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'boolean', default: false })
  requiresTracking: boolean;

  @Column({ type: 'boolean', default: false })
  requiresSignature: boolean;

  @Column({ type: 'boolean', default: false })
  isExpress: boolean;

  @Column({ type: 'json', nullable: true })
  restrictions: any;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ShippingRate, rate => rate.shippingMethod)
  rates: ShippingRate[];
} 