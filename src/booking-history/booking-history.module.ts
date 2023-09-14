import { Module } from '@nestjs/common';
import { BookingHistoryController } from './booking-history.controller';
import { BookingHistoryService } from './booking-history.service';

@Module({
  controllers: [BookingHistoryController],
  providers: [BookingHistoryService],
})
export class BookingHistoryModule {}
