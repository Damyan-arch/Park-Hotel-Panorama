import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.room.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
