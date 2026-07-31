import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
    private readonly prisma: PrismaService,
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

    const room = await this.prisma.room.findUnique({ where: { id: dto.roomId } });
    if (!room || !room.isActive) {
      throw new NotFoundException('Room not found.');
    }

    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        roomId: dto.roomId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        checkInDate: { lt: checkOut },
        checkOutDate: { gt: checkIn },
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

    try {
      return await this.prisma.reservation.create({
        data: {
          roomId: room.id,
          guestId: guest.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: dto.numberOfGuests ?? 1,
          totalPrice,
          currency: room.currency,
        },
        include: { room: true, guest: true },
      });
    } catch (error) {
      if (isExclusionViolation(error)) {
        throw new ConflictException('This room is not available for the selected dates.');
      }
      throw error;
    }
  }
}
