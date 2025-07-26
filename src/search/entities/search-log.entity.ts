import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SearchType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND',
  GENERAL = 'GENERAL',
}

@Entity()
export class SearchLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  query: string;

  @Column({
    type: 'enum',
    enum: SearchType,
    default: SearchType.GENERAL,
  })
  type: SearchType;

  @Column({ type: 'int', default: 0 })
  resultCount: number;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @Column({ type: 'boolean', default: false })
  hasResults: boolean;

  @Column({ type: 'json', nullable: true })
  filters: any;

  @Column({ type: 'json', nullable: true })
  sortBy: any;

  @Column({ type: 'int', default: 0 })
  page: number;

  @Column({ type: 'int', default: 0 })
  limit: number;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'text', nullable: true })
  ipAddress: string;

  @Column({ type: 'json', nullable: true })
  location: any;

  @Column({ type: 'text', nullable: true })
  referrer: string;

  @Column({ type: 'json', nullable: true })
  sessionData: any;

  @Column({ type: 'int', default: 0 })
  responseTime: number; // in milliseconds

  @Column({ type: 'boolean', default: false })
  isSuccessful: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
} 