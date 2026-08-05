import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGalleryPhotoDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  altTextEn?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
