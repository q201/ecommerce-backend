import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column('decimal')
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  type: string; // e.g., percentage, fixed_amount

  @Column({ nullable: true })
  starts_at: Date;

  @Column({ nullable: true })
  ends_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
