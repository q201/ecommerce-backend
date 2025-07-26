import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RatingType {
  OVERALL = 'OVERALL',
  QUALITY = 'QUALITY',
  VALUE = 'VALUE',
  EASE_OF_USE = 'EASE_OF_USE',
  DESIGN = 'DESIGN',
  FEATURES = 'FEATURES',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  SHIPPING = 'SHIPPING',
}

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: RatingType,
    default: RatingType.OVERALL,
  })
  type: RatingType;

  @Column({ type: 'int' })
  rating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'boolean', default: false })
  isAnonymous: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 