import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomLogger } from '../logger/logger.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let passwordService: PasswordService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: CustomLogger;

  const mockRequest = {
    session: { destroy: jest.fn((callback) => callback(null)) },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            checkPassword: jest.fn(),
          },
        },
        {
          provide: CustomLogger,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    passwordService = module.get<PasswordService>(PasswordService);
    logger = module.get<CustomLogger>(CustomLogger);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw BadRequestException if password does not meet requirements', async () => {
      await expect(
        authService.validateUser('test@test.com', 'short'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.validateUser('nonexistent@test.com', 'ValidP@ssw0rd'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  it('should throw UnauthorizedException if user is not active', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      active: false,
    });

    await expect(
      authService.validateUser('inactive@test.com', 'ValidP@ssw0rd'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      active: true,
      password: 'CorrectP@ssw0rd',
    });
    (passwordService.checkPassword as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.validateUser('test@test.com', 'IncorrectP@ssw0rd'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return the user if validation is successful', async () => {
    const user = {
      active: true,
      password: 'CorrectP@ssw0rd',
    };

    (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
    (passwordService.checkPassword as jest.Mock).mockResolvedValue(true);

    await expect(
      authService.validateUser('test@test.com', 'CorrectP@ssw0rd'),
    ).resolves.toEqual(user);
  });

  describe('logout', () => {
    it('should throw error if session destruction fails', () => {
      mockRequest.session.destroy.mockImplementation((callback) =>
        callback(new Error('session destruction failed')),
      );

      return expect(authService.logout()).rejects.toThrowError(
        'session destruction failed',
      );
    });

    it('should resolve if session destruction is successful', () => {
      mockRequest.session.destroy.mockImplementation((callback) =>
        callback(null),
      );

      return expect(authService.logout()).resolves.toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return the user with the provided id', async () => {
      const user = new UserEntity();
      (usersService.findById as jest.Mock).mockResolvedValue(user);

      await expect(authService.findById(1)).resolves.toEqual(user);
    });
  });
});
