import { BaseEntity } from '@/base/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column('int')
  price: number;

  @Column('text')
  description: string;
}
