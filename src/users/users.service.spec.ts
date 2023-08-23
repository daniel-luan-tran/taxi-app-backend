import { Test } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { testActiveUser, testUsers } from '../../test/data/users';
import { Role } from '../auth/entities/role.enum';
import { PasswordService } from '../auth/password.service';
import { UsersService } from './users.service';

class MockPrismaService {
  user = {
    findMany: jest.fn().mockResolvedValue(testUsers),
    findFirst: jest.fn().mockResolvedValue(testActiveUser),
    create: jest.fn().mockResolvedValue(testActiveUser),
    update: jest.fn().mockResolvedValue(testActiveUser),
  };
}

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersService.findAll();
      expect(result).toEqual(testUsers);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const result = await usersService.findById(testActiveUser.id);

      expect(result).toEqual(testActiveUser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        ...testActiveUser,
        role: Role.STAFF,
        password: 'password',
      };
      delete newUser.id;
      const createdUser = await usersService.create(newUser);

      expect(createdUser).toEqual(testActiveUser);
    });
  });

  // describe('update', () => {
  //   it('should update a user with password', async () => {});
  //   it('should update a user without password', async () => {});
  // });
});
