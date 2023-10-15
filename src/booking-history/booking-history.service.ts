import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking-history.dto';
import { CustomLogger } from 'src/logger/logger.service';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import * as _ from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { BookingHistoryEntity } from './entities/account.entity';

@Injectable()
export class BookingHistoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
  ) {}

  public async addNewBooking(
    data: CreateBookingDto,
  ): Promise<BookingHistoryEntity> {
    this.logger.log({
      context: `${BookingHistoryService.name} ${this.addNewBooking.name}`,
      event_type: LogEventType.BOOKING_HISTORY,
      reason: LogEventReason.BOOKING_HISTORY_CREATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return await this.prismaService.bookingHistory.create({
      data: data,
      include: { user: true, driver: true },
    });
  }
}
