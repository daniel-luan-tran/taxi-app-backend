import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.service';
import { BookingHistoryService } from 'src/booking-history/booking-history.service';
import { PrismaService } from 'nestjs-prisma';
import { CustomLogger } from 'src/logger/logger.service';

@Module({
  providers: [
    SocketGateway,
    BookingHistoryService,
    PrismaService,
    CustomLogger,
  ],
})
export class SocketModule {}
