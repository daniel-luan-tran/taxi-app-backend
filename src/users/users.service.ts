import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../auth/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return this.prismaService.user.findMany();
  }

  public async findById(id: string): Promise<UserEntity> {
    return this.prismaService.user.findFirst({
      where: { id },
    });
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }

  public async create(data: CreateUserDto): Promise<UserEntity> {
    const { password, ...user } = data;
    const hashedPassword = await this.passwordService.hashPassword(password);
    return this.prismaService.user.create({
      data: {
        ...user,
        password: { create: { password: hashedPassword } },
      },
    });
  }

  public async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const { password, ...user } = data;
    let passwordHash: string;

    if (password) {
      passwordHash = await this.passwordService.hashPassword(password);
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...user,
        password: passwordHash ? { update: { password: passwordHash } } : {},
      },
    });
  }
}
