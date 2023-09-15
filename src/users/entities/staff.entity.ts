import { Staff } from '@prisma/client';

export class StaffEntity implements Staff {
  id: string;
  accountId: string;
}
