import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entities/account.entity';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import { CustomLogger } from '../logger/logger.service';
import * as _ from 'lodash';

@Injectable()
export class AzureAccountsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
  ) {}

  public async findAll(): Promise<AccountEntity[]> {
    return this.prismaService.account.findMany({
      where: {
        azureOid: {
          not: null,
        },
      },
      include: { User: true, Driver: true, Staff: true },
    });
  }

  public async findById(id: string): Promise<AccountEntity> {
    return this.prismaService.account.findFirst({
      where: { id },
      include: {
        User: true,
        Driver: { include: { driverType: true } },
        Staff: true,
      },
    });
  }

  public async findByAzureOid(azureOid: string): Promise<AccountEntity> {
    return this.prismaService.account.findFirst({
      where: { azureOid },
      include: { User: true, Driver: true, Staff: true },
    });
  }

  public async findByEmail(email: string): Promise<AccountEntity> {
    return this.prismaService.account.findFirst({
      where: { email },
      include: { User: true, Driver: true, Staff: true },
    });
  }

  public async create(data: CreateAccountDto): Promise<AccountEntity> {
    const { password, ...user } = data;
    this.logger.log({
      context: `${AzureAccountsService.name} ${this.create.name}`,
      event_type: LogEventType.ACCOUNT,
      reason: LogEventReason.ACCOUNT_CREATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return this.prismaService.account.create({
      data: {
        ...user,
      },
    });
  }

  public async update(
    id: string,
    data: UpdateAccountDto,
  ): Promise<AccountEntity> {
    const { password, driverTypeId, ...user } = data;
    this.logger.log({
      context: `${AzureAccountsService.name} ${this.update.name}`,
      event_type: LogEventType.ACCOUNT,
      reason: LogEventReason.ACCOUNT_UPDATED,
      metadata: { ..._.pick(data, ['id']) },
    });
    return this.prismaService.account.update({
      where: { id },
      data: {
        ...user,
        Driver: driverTypeId && {
          update: {
            driverTypeId: driverTypeId,
          },
        },
      },
      include: { User: true, Driver: true, Staff: true },
    });
  }

  public async deleteUser(id: string): Promise<AccountEntity> {
    this.logger.log({
      context: `${AzureAccountsService.name} ${this.deleteUser.name}`,
      event_type: LogEventType.ACCOUNT,
      reason: LogEventReason.ACCOUNT_DELETED,
    });

    return this.prismaService.account.update({
      where: { id },
      data: {
        active: false,
      },
      include: { User: true, Driver: true, Staff: true },
    });
  }
}
