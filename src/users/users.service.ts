import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../auth/password.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  public async findAll(): Promise<AccountEntity[]> {
    return this.prismaService.account.findMany();
  }

  public async findById(id: string): Promise<AccountEntity> {
    return this.prismaService.account.findFirst({
      where: { id },
      include: { Driver: { include: { driverType: true } }, User: true },
    });
  }

  public async findByEmail(email: string): Promise<AccountEntity> {
    return this.prismaService.account.findFirst({
      where: { email },
    });
  }

  public async create(data: CreateAccountDto): Promise<AccountEntity> {
    const { password, ...user } = data;
    const hashedPassword = await this.passwordService.hashPassword(password);
    return this.prismaService.account.create({
      data: {
        ...user,
        password: { create: { password: hashedPassword } },
      },
    });
  }

  public async update(
    id: string,
    data: UpdateAccountDto,
  ): Promise<AccountEntity> {
    const { password, ...user } = data;
    let passwordHash: string;

    if (password) {
      passwordHash = await this.passwordService.hashPassword(password);
    }

    return this.prismaService.account.update({
      where: { id },
      data: {
        ...user,
        password: passwordHash ? { update: { password: passwordHash } } : {},
      },
    });
  }
}
