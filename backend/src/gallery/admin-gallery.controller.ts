import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryPhotoDto } from './dto/create-gallery-photo.dto';
import { UpdateGalleryPhotoDto } from './dto/update-gallery-photo.dto';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('admin/gallery')
@UseGuards(AdminAuthGuard)
export class AdminGalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  create(@Body() dto: CreateGalleryPhotoDto) {
    return this.galleryService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGalleryPhotoDto) {
    return this.galleryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
