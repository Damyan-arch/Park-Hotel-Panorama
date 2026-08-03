import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../rooms/room.entity';
import { Guest } from '../guests/guest.entity';
import { Payment } from '../payments/payment.entity';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

// Overlapping (roomId, checkInDate, checkOutDate) ranges for PENDING/CONFIRMED
// reservations are blocked by a hand-written GiST exclusion constraint added
// in the baseline migration (TypeORM's decorators can't express it directly).
@Entity('Reservation')
@Index(['roomId', 'checkInDate', 'checkOutDate'])
export class Reservation {
  @PrimaryColumn('text')
  id: string;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: string;

  @ManyToOne(() => Guest, (guest) => guest.reservations)
  @JoinColumn({ name: 'guestId' })
  guest: Guest;

  @Column()
  guestId: string;

  @Column({ type: 'date' })
  checkInDate: string;

  @Column({ type: 'date' })
  checkOutDate: string;

  @Column()
  numberOfGuests: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    enumName: 'ReservationStatus',
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: string;

  @Column({ default: 'EUR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  specialRequests: string | null;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @OneToOne(() => Payment, (payment) => payment.reservation)
  payment: Payment;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) this.id = randomUUID();
  }
}
