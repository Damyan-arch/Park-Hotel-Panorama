import { BadRequestException, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

const ALLOWED_CATEGORIES = ['rooms', 'gallery'] as const;
type UploadCategory = (typeof ALLOWED_CATEGORIES)[number];

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOADS_ROOT = join(process.cwd(), 'uploads');

function isUploadCategory(value: string): value is UploadCategory {
  return (ALLOWED_CATEGORIES as readonly string[]).includes(value);
}

@Controller('admin/uploads')
@UseGuards(AdminAuthGuard)
export class UploadsController {
  @Post(':category')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (request, _file, callback) => {
          const category = (request.params as { category: string }).category;
          if (!isUploadCategory(category)) {
            callback(new BadRequestException('Unknown upload category.'), '');
            return;
          }
          const dir = join(UPLOADS_ROOT, category);
          mkdirSync(dir, { recursive: true });
          callback(null, dir);
        },
        filename: (_request, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_request, file, callback) => {
        callback(null, ALLOWED_MIME_TYPES.includes(file.mimetype));
      },
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  upload(@Param('category') category: string, @UploadedFile() file?: Express.Multer.File) {
    if (!isUploadCategory(category) || !file) {
      throw new BadRequestException('Invalid upload.');
    }
    return { url: `/uploads/${category}/${file.filename}` };
  }
}
