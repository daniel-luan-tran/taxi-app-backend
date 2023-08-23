import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma';
import {
  testActiveUser,
  testStaffUser,
  testUsers,
} from '../../test/data/users';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/entities/role.enum';
import { PasswordService } from '../auth/password.service';
import { CustomLogger } from '../logger/logger.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

class MockUsersService {
  findAll = jest.fn().mockResolvedValue(Promise.resolve(testUsers));
  findById = jest.fn().mockResolvedValue(testActiveUser);
  create = jest.fn().mockResolvedValue(testActiveUser);
  update = jest.fn().mockResolvedValue(testActiveUser);
}

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const mockRequest = {
      headers: {},
      body: {},
    } as Request;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useClass: MockUsersService,
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
        AuthService,
        PasswordService,
        CustomLogger,
        PrismaService,
      ],
      controllers: [UsersController],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await usersController.findAll()).toBe(testUsers);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const response = await usersController.findById(testActiveUser.id);
      expect(response).toBe(testActiveUser);
    });
  });

  describe('create', () => {
    it('should return a user', async () => {
      const newUser = {
        ...testStaffUser,
        role: Role.STAFF,
        password: 'password',
      };
      const response = await usersController.create(newUser);

      expect(response).toEqual(testActiveUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const newUser = { ...testStaffUser, role: Role.STAFF };
      const response = await usersController.update(testStaffUser.id, newUser);

      expect(response).toEqual(testActiveUser);
    });
  });
});
