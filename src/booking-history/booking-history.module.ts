import { Module } from '@nestjs/common';
import { BookingHistoryController } from './booking-history.controller';
import { BookingHistoryService } from './booking-history.service';
import { CustomLogger } from 'src/logger/logger.service';

@Module({
  controllers: [BookingHistoryController],
  providers: [BookingHistoryService, CustomLogger],
})
export class BookingHistoryModule {}
