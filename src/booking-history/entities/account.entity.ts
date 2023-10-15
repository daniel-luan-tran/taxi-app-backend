import { BOOKINGSTATUS, BookingHistory } from '@prisma/client';

export class BookingHistoryEntity implements BookingHistory {
  id: string;
  userId: string;
  driverId: string;
  bookAt: Date;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  status: BOOKINGSTATUS;
}
