import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { testActiveUser } from '../../test/data/users';
import { UserEntity } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      logout: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot({ ttl: 60, limit: 10 })],
      providers: [
        ThrottlerGuard,
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('Should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return user after successful login', async () => {
    const user: UserEntity = testActiveUser;

    authService.validateUser.mockResolvedValue(user);

    expect(await authController.login(user)).toBe(user);
  });

  it('should throw UnauthorizedException if validateUser fails due to incorrect password', async () => {
    jest.spyOn(authService, 'validateUser').mockImplementation(() => {
      throw new UnauthorizedException();
    });

    try {
      await authController.login({ password: 'wrong_password' } as any);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw NotFoundException if validateUser fails due to non-existing user', async () => {
    jest.spyOn(authService, 'validateUser').mockImplementation(() => {
      throw new NotFoundException();
    });

    try {
      await authController.login({ email: 'nonexistent@example.com' } as any);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should throw BadRequestException if validateUser fails due to invalid password', async () => {
    jest.spyOn(authService, 'validateUser').mockImplementation(() => {
      throw new BadRequestException();
    });

    try {
      await authController.login({ password: 'invalid' } as any);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  // it('should return roles', async () => {
  //   expect(await authController.getRoles()).toEqual(Object.values(Role));
  // });

  it('should return user on check', async () => {
    const user: UserEntity = testActiveUser;

    expect(await authController.check(user)).toBe(user);
  });

  it('should call AuthService logout on logout', async () => {
    const logoutSpy = jest
      .spyOn(authService, 'logout')
      .mockResolvedValue(() => Promise.resolve());

    await authController.logout();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
