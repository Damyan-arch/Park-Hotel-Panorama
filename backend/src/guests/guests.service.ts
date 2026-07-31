import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(details: GuestDetails) {
    const existing = await this.prisma.guest.findUnique({ where: { email: details.email } });

    if (existing) {
      return this.prisma.guest.update({
        where: { id: existing.id },
        data: {
          firstName: details.firstName,
          lastName: details.lastName,
          phone: details.phone,
        },
      });
    }

    return this.prisma.guest.create({ data: details });
  }
}
