import { BOOKINGSTATUS, BOOKINGTYPE } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  driverId: string;

  @IsNotEmpty()
  startLat: number;

  @IsNotEmpty()
  startLng: number;

  @IsNotEmpty()
  endLat: number;

  @IsNotEmpty()
  endLng: number;

  @IsOptional()
  status: BOOKINGSTATUS;

  @IsNotEmpty()
  bookingType: BOOKINGTYPE;
}
