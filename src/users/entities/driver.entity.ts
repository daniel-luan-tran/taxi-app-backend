import { Driver } from '@prisma/client';

export class DriverEntity implements Driver {
  id: string;
  accountId: string;
  driverTypeId: number;
}
