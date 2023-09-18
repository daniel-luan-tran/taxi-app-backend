import { Driver, DriverType } from '@prisma/client';

export class DriverEntity implements Driver {
  id: string;
  accountId: string;
  driverTypeId: number;
}

export class DriverTypeEntity implements DriverType {
  id: number;
  name: string;
}
