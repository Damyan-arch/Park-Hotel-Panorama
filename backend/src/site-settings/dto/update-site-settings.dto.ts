import { IsOptional, IsString } from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  restaurantHoursDays?: string;

  @IsOptional()
  @IsString()
  restaurantHoursText?: string;
}
