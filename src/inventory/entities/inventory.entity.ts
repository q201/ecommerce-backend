import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { StockMovement } from './stock-movement.entity';
import { Warehouse } from './warehouse.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  warehouseId: string;

  @Column({ type: 'int', default: 0 })
  currentStock: number;

  @Column({ type: 'int', default: 0 })
  reservedStock: number;

  @Column({ type: 'int', default: 0 })
  availableStock: number;

  @Column({ type: 'int', default: 0 })
  minimumStock: number;

  @Column({ type: 'int', default: 0 })
  maximumStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalValue: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, product => product.inventories)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Warehouse, warehouse => warehouse.inventories)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @OneToMany(() => StockMovement, movement => movement.inventory)
  stockMovements: StockMovement[];
}
