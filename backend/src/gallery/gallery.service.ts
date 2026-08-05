import { unlink } from 'fs';
import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryPhoto } from './gallery-photo.entity';
import { CreateGalleryPhotoDto } from './dto/create-gallery-photo.dto';
import { UpdateGalleryPhotoDto } from './dto/update-gallery-photo.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryPhoto) private readonly photos: Repository<GalleryPhoto>,
  ) {}

  findAll() {
    return this.photos.find({ order: { sortOrder: 'ASC' } });
  }

  create(dto: CreateGalleryPhotoDto) {
    const photo = this.photos.create(dto);
    return this.photos.save(photo);
  }

  async update(id: string, dto: UpdateGalleryPhotoDto): Promise<GalleryPhoto> {
    const photo = await this.photos.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Gallery photo not found.');
    }
    Object.assign(photo, dto);
    return this.photos.save(photo);
  }

  async remove(id: string): Promise<void> {
    const photo = await this.photos.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Gallery photo not found.');
    }

    await this.photos.delete(id);

    // Only admin-uploaded files live under /uploads — the originally seeded
    // photos are static assets checked into the frontend and must not be touched.
    if (photo.imageUrl.startsWith('/uploads/')) {
      unlink(join(process.cwd(), photo.imageUrl), () => {});
    }
  }
}
