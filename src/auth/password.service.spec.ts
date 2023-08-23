import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { testPasswordRecord1 } from '../../test/data/password';
import { PasswordService } from './password.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

class MockPrismaService {
  password = {
    findFirst: jest.fn().mockResolvedValue(testPasswordRecord1),
  };
}

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
      ],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should return a hashed password', async () => {
      const salt = 'random-salt';
      const hashedPassword = 'hashed-password';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const password = 'password';
      const result = await passwordService.hashPassword(password);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(result).toEqual(hashedPassword);
    });
  });

  describe('compare', () => {
    it('should return true if passwords match', async () => {
      const { userId, password } = testPasswordRecord1;

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jest
        .spyOn(passwordService, 'getPasswordRecord')
        .mockImplementation(() => Promise.resolve(testPasswordRecord1));

      const result = await passwordService.checkPassword(userId, password);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        testPasswordRecord1.password,
      );
      expect(result).toBeTruthy();
    });

    it('should return false if passwords do not match', async () => {
      const { userId } = testPasswordRecord1;
      const password = 'wrong-password';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      jest
        .spyOn(passwordService, 'getPasswordRecord')
        .mockImplementation(() => Promise.resolve(testPasswordRecord1));

      const result = await passwordService.checkPassword(userId, password);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        testPasswordRecord1.password,
      );
      expect(result).toBeFalsy();
    });
  });
});
