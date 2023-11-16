import { User } from '@prisma/client';
import { AccountEntity } from './account.entity';

export class UserEntity implements User {
  id: string;
  accountId: string;
  account?: AccountEntity;
}
