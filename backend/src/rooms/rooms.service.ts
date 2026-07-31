import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private readonly rooms: Repository<Room>) {}

  findActive() {
    return this.rooms.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }
}
