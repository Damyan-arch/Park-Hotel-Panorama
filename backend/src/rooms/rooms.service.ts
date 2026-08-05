import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

const FOREIGN_KEY_VIOLATION_CODE = '23503';

function isForeignKeyViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as { code?: unknown; cause?: unknown };
  if (candidate.code === FOREIGN_KEY_VIOLATION_CODE) return true;
  return candidate.cause ? isForeignKeyViolation(candidate.cause) : false;
}

@Injectable()
export class RoomsService {
  constructor(@InjectRepository(Room) private readonly rooms: Repository<Room>) {}

  findActive() {
    return this.rooms.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  findAll() {
    return this.rooms.find({ order: { name: 'ASC' } });
  }

  create(dto: CreateRoomDto) {
    const room = this.rooms.create(dto);
    return this.rooms.save(room);
  }

  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.rooms.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found.');
    }
    Object.assign(room, dto);
    return this.rooms.save(room);
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.rooms.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Room not found.');
      }
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          'This room has existing reservations — deactivate it instead of deleting it.',
        );
      }
      throw error;
    }
  }
}
