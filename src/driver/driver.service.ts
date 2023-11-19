import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { DriverEntity } from 'src/users/entities/driver.entity';

@Injectable()
export class DriverService {
  constructor(private readonly prismaService: PrismaService) {}
  public async getDriver(): Promise<DriverEntity[]> {
    const drivers = this.prismaService.driver.findMany({
      include: {
        account: true,
      },
    });
    return drivers;
  }
}
