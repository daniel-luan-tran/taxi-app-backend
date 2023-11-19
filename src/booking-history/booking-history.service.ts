import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking-history.dto';
import { CustomLogger } from 'src/logger/logger.service';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import * as _ from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { BookingHistoryEntity } from './entities/account.entity';
import { UpdateBookingDto } from './dto/update-booking-history.dto';

@Injectable()
export class BookingHistoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
  ) {}

  public async getBookingHistory(): Promise<BookingHistoryEntity[]> {
    return await this.prismaService.bookingHistory.findMany({
      include: {
        user: { include: { account: true } },
        driver: { include: { account: true, driverType: true } },
      },
    });
  }

  public async getBookingHistoryById(
    id: string,
  ): Promise<BookingHistoryEntity> {
    const res = await this.prismaService.bookingHistory.findFirst({
      where: { id },
      include: {
        user: { include: { account: true } },
        driver: { include: { account: true, driverType: true } },
      },
    });

    return res;
  }

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

  public async updateBooking(
    id: string,
    data: UpdateBookingDto,
  ): Promise<BookingHistoryEntity> {
    this.logger.log({
      context: `${BookingHistoryService.name} ${this.updateBooking.name}`,
      event_type: LogEventType.BOOKING_HISTORY,
      reason: LogEventReason.BOOKING_HISTORY_UPDATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return await this.prismaService.bookingHistory.update({
      where: { id },
      data: { ...data },
      include: { user: true, driver: true },
    });
  }
}
