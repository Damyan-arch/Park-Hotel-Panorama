import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SUITE = 'SUITE',
  FAMILY = 'FAMILY',
}

@Entity('Room')
export class Room {
  @PrimaryColumn('text')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoomType, enumName: 'RoomType' })
  type: RoomType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  capacity: number;

  @Column('integer', { nullable: true })
  sizeSqm: number | null;

  @Column('decimal', { precision: 10, scale: 2 })
  basePricePerNight: string;

  @Column({ default: 'EUR' })
  currency: string;

  @Column('text', { array: true, nullable: true })
  imageUrls: string[] | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @BeforeInsert()
  generateId(): void {
    if (!this.id) this.id = randomUUID();
  }
}
