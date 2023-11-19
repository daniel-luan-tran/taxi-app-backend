import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking-history.dto';
import { BookingHistoryService } from './booking-history.service';
import { UpdateBookingDto } from './dto/update-booking-history.dto';
import { BookingHistoryEntity } from './entities/account.entity';

@Controller('booking-history')
export class BookingHistoryController {
  constructor(private readonly bookingHistoryService: BookingHistoryService) {}

  @Get('/')
  public async getBookingHistory(): Promise<BookingHistoryEntity[]> {
    return await this.bookingHistoryService.getBookingHistory();
  }

  @Post('/')
  public async addNewBooking(
    @Body() data: CreateBookingDto,
  ): Promise<BookingHistoryEntity> {
    return await this.bookingHistoryService.addNewBooking(data);
  }

  @Get('/:id')
  public async getBookingHistoryById(
    @Param('id') id: string,
  ): Promise<BookingHistoryEntity> {
    return await this.bookingHistoryService.getBookingHistoryById(id);
  }

  @Put('/:id')
  public async updateBooking(
    @Param('id') id: string,
    @Body() data: UpdateBookingDto,
  ): Promise<BookingHistoryEntity> {
    return await this.bookingHistoryService.updateBooking(id, data);
  }
}
