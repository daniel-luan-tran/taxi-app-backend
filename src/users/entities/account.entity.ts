import { Account } from '@prisma/client';

export class AccountEntity implements Account {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  active: boolean;
  createdAt: Date;
  createdUserId: string | null;
  updatedAt: Date;
  updatedUserId: string | null;
  azureOid: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  address: string | null;
}
