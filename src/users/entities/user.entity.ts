import { User, UserRole } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  active: boolean;
  role: UserRole;
  createdAt: Date;
  createdUserId: string | null;
  updatedAt: Date;
  updatedUserId: string | null;
  azureOid: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  address: string | null;
}
