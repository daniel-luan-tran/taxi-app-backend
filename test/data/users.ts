import { UserEntity } from 'src/users/entities/user.entity';
import { Role } from '../../src/auth/entities/role.enum';

export const testAdminUser: UserEntity = {
  id: '1',
  email: 'admin@blackbook',
  firstName: 'Admin',
  lastName: 'User',
  role: Role.ADMIN,
  active: true,
  createdUserId: '1',
  createdAt: new Date(),
  updatedUserId: '1',
  updatedAt: new Date(),
};

export const testStaffUser: UserEntity = {
  id: '2',
  email: 'staff@blackbook',
  firstName: 'Staff',
  lastName: 'User',
  role: Role.STAFF,
  active: true,
  createdUserId: '1',
  createdAt: new Date(),
  updatedUserId: '1',
  updatedAt: new Date(),
};

export const testActiveUser: UserEntity = {
  id: '3',
  email: 'active@blackbook',
  firstName: 'Active',
  lastName: 'User',
  role: Role.STAFF,
  active: true,
  createdUserId: '1',
  createdAt: new Date(),
  updatedUserId: '1',
  updatedAt: new Date(),
};

export const testInactiveUser: UserEntity = {
  id: '4',
  email: 'inactive@blackbook',
  firstName: 'Inactive',
  lastName: 'User',
  role: Role.STAFF,
  active: false,
  createdUserId: '1',
  createdAt: new Date(),
  updatedUserId: '1',
  updatedAt: new Date(),
};

export const testUsers: UserEntity[] = [
  testAdminUser,
  testStaffUser,
  testActiveUser,
  testInactiveUser,
];
