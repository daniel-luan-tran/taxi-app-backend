import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { DriverTypeEntity } from 'src/users/entities/driver.entity';

@Injectable()
export class DriverTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(): Promise<DriverTypeEntity[]> {
    const driverTypes = await this.prismaService.driverType.findMany();
    return driverTypes;
  }
}
