import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { Room } from '../rooms/room.entity';
import { GuestsService } from '../guests/guests.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

const EXCLUSION_VIOLATION_CODE = '23P01';

function isExclusionViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as { code?: unknown; cause?: unknown };
  if (candidate.code === EXCLUSION_VIOLATION_CODE) return true;
  return candidate.cause ? isExclusionViolation(candidate.cause) : false;
}

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservations: Repository<Reservation>,
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
    private readonly guestsService: GuestsService,
  ) {}

  async create(dto: CreateReservationDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      throw new BadRequestException('Check-in date cannot be in the past.');
    }

    const room = await this.rooms.findOne({ where: { id: dto.roomId } });
    if (!room || !room.isActive) {
      throw new NotFoundException('Room not found.');
    }

    const overlapping = await this.reservations.findOne({
      where: {
        roomId: dto.roomId,
        status: In([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
        checkInDate: LessThan(dto.checkOut),
        checkOutDate: MoreThan(dto.checkIn),
      },
    });
    if (overlapping) {
      throw new ConflictException('This room is not available for the selected dates.');
    }

    const [firstName, ...rest] = dto.fullName.trim().split(/\s+/);
    const lastName = rest.join(' ') || firstName;

    const guest = await this.guestsService.findOrCreate({
      firstName,
      lastName,
      email: dto.email,
      phone: dto.phone,
    });

    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = Number(room.basePricePerNight) * nights;

    const reservation = this.reservations.create({
      roomId: room.id,
      guestId: guest.id,
      checkInDate: dto.checkIn,
      checkOutDate: dto.checkOut,
      numberOfGuests: dto.numberOfGuests ?? 1,
      totalPrice: totalPrice.toFixed(2),
      currency: room.currency,
    });

    try {
      const saved = await this.reservations.save(reservation);
      return this.reservations.findOne({
        where: { id: saved.id },
        relations: { room: true, guest: true },
      });
    } catch (error) {
      if (isExclusionViolation(error)) {
        throw new ConflictException('This room is not available for the selected dates.');
      }
      throw error;
    }
  }
}
