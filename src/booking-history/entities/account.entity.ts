import { BOOKINGSTATUS, BOOKINGTYPE, BookingHistory } from '@prisma/client';
import { DriverEntity } from 'src/users/entities/driver.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class BookingHistoryEntity implements BookingHistory {
  id: string;
  userId: string;
  user?: UserEntity;
  driverId: string;
  driver?: DriverEntity;
  bookAt: Date;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  status: BOOKINGSTATUS;
  bookingType: BOOKINGTYPE;
}
