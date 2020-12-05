import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRoles {
  Admin,
  User,
}

export enum ItemStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column({ default: 1 })
  bid: number;

  @Column('text', { array: true, nullable: true })
  bidHistory: string[];

  @Column()
  closeDate: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  highestBidder: string;

  @ManyToMany(
    () => User,
    user => user.items,
  )
  @JoinTable()
  users: User[];

  @Column({ default: ItemStatus.OPEN })
  status: ItemStatus;
}
