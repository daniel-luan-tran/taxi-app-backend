import { Password } from '@prisma/client';

export const testPasswordRecord1: Password = {
  id: '1',
  password: 'hashed-password-1',
  userId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};
