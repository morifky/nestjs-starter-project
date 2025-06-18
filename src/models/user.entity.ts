import { BaseEntity } from '@/base/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;
}
