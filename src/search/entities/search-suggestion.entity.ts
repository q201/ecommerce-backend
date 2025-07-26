import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SuggestionType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND',
  TAG = 'TAG',
  POPULAR = 'POPULAR',
  TRENDING = 'TRENDING',
}

@Entity()
export class SearchSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  term: string;

  @Column({
    type: 'enum',
    enum: SuggestionType,
  })
  type: SuggestionType;

  @Column({ type: 'int', default: 0 })
  frequency: number;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  relevanceScore: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  categories: string[];

  @Column({ type: 'json', nullable: true })
  synonyms: string[];

  @Column({ type: 'json', nullable: true })
  relatedTerms: string[];

  @Column({ type: 'timestamp', nullable: true })
  lastUsed: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 