import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  address_1: string;

  @Column({ nullable: true })
  address_2: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  country_code: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;
}
