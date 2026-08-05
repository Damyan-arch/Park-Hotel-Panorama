import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryPhoto } from './gallery-photo.entity';
import { GalleryController } from './gallery.controller';
import { AdminGalleryController } from './admin-gallery.controller';
import { GalleryService } from './gallery.service';
import { AdminAuthModule } from '../admin-auth/admin-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryPhoto]), AdminAuthModule],
  controllers: [GalleryController, AdminGalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
