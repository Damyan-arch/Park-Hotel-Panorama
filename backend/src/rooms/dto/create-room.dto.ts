import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RoomType } from '../room.entity';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsEnum(RoomType)
  type: RoomType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  sizeSqm?: number;

  @IsNumberString()
  basePricePerNight: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
