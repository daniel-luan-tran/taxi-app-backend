import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking-history.dto';
import { BookingHistoryService } from './booking-history.service';

@Controller('booking-history')
export class BookingHistoryController {
  constructor(private readonly bookingHistoryService: BookingHistoryService) {}

  @Post('/')
  public async addNewBooking(
    @Body() data: CreateBookingDto,
  ): Promise<CreateBookingDto> {
    return await this.bookingHistoryService.addNewBooking(data);
  }
}
