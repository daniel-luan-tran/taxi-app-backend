import { Driver, DriverType } from '@prisma/client';
import { AccountEntity } from './account.entity';

export class DriverEntity implements Driver {
  id: string;
  accountId: string;
  account?: AccountEntity;
  driverTypeId: number;
}

export class DriverTypeEntity implements DriverType {
  id: number;
  name: string;
}
