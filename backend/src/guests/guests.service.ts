import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './guest.entity';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

@Injectable()
export class GuestsService {
  constructor(@InjectRepository(Guest) private readonly guests: Repository<Guest>) {}

  async findOrCreate(details: GuestDetails): Promise<Guest> {
    const existing = await this.guests.findOne({ where: { email: details.email } });

    if (existing) {
      existing.firstName = details.firstName;
      existing.lastName = details.lastName;
      existing.phone = details.phone ?? null;
      return this.guests.save(existing);
    }

    return this.guests.save(
      this.guests.create({
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone ?? null,
      }),
    );
  }
}
