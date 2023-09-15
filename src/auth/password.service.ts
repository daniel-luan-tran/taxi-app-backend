import { Injectable } from '@nestjs/common';
import { Password } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PasswordService {
  constructor(private readonly prismaService: PrismaService) {}

  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();

    return hash(password, salt);
  }

  public async getPasswordRecord(userId: string): Promise<Password> {
    return await this.prismaService.password.findFirst({
      where: { id: userId },
    });
  }

  public async checkPassword(userId: string, password): Promise<boolean> {
    const passwordRecord = await this.getPasswordRecord(userId);
    return compare(password, passwordRecord.password);
  }
}
