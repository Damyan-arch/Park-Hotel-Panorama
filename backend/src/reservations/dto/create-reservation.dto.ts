import { IsDateString, IsEmail, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfGuests?: number;
}
