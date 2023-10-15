import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking-history.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
