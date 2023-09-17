import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverEntity } from './entities/driver.entity';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import { CustomLogger } from '../logger/logger.service';
import * as _ from 'lodash';
import { AzureAccountsService } from './azure-account.service';
import { AccountEntity } from './entities/account.entity';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AzureDriversService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
    private readonly azureAccountsService: AzureAccountsService,
  ) {}

  public async findAll(): Promise<DriverEntity[]> {
    const drivers = await this.prismaService.driver.findMany({
      include: { account: true },
    });
    return drivers;
  }

  public async findById(id: string): Promise<DriverEntity> {
    return this.prismaService.driver.findFirst({
      where: { id },
      include: { account: true },
    });
  }

  public async findByAzureOid(azureOid: string): Promise<DriverEntity> {
    const account = await this.azureAccountsService.findByAzureOid(azureOid);
    return this.prismaService.driver.findFirst({
      where: { accountId: account.id },
      include: { account: true },
    });
  }

  public async findByEmail(email: string): Promise<DriverEntity> {
    const account = await this.azureAccountsService.findByEmail(email);
    return this.prismaService.driver.findFirst({
      where: { accountId: account.id },
      include: { account: true },
    });
  }

  public async create(data: CreateDriverDto): Promise<DriverEntity> {
    const { ...user } = data;
    this.logger.log({
      context: `${AzureDriversService.name} ${this.create.name}`,
      event_type: LogEventType.DRIVER,
      reason: LogEventReason.DRIVER_CREATED,
      metadata: { ..._.pick(data, ['id', 'role']) },
    });

    return this.prismaService.driver.create({
      data: {
        ...user,
      },
      include: { account: true },
    });
  }

  public async update(
    id: string,
    data: UpdateAccountDto,
  ): Promise<AccountEntity> {
    const { password, ...user } = data;

    this.logger.log({
      context: `${AzureDriversService.name} ${this.deleteUser.name}`,
      event_type: LogEventType.DRIVER,
      reason: LogEventReason.DRIVER_UPDATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    const res = await this.prismaService.account.update({
      where: { id },
      data: {
        ...user,
        Driver: {
          upsert: {
            create: {
              driverTypeId: user.driverTypeId,
            },
            update: {
              driverTypeId: user.driverTypeId,
            },
          },
        },
      },
      include: { Driver: true },
    });

    return res;
  }

  public async deleteUser(id: string): Promise<DriverEntity> {
    this.logger.log({
      context: `${AzureDriversService.name} ${this.deleteUser.name}`,
      event_type: LogEventType.DRIVER,
      reason: LogEventReason.DRIVER_DELETED,
    });

    return this.prismaService.driver.delete({
      where: { id },
    });
  }
}
