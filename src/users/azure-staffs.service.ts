import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffEntity } from './entities/staff.entity';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import { CustomLogger } from '../logger/logger.service';
import * as _ from 'lodash';
import { AzureAccountsService } from './azure-account.service';

@Injectable()
export class AzureStaffsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
    private readonly azureAccountsService: AzureAccountsService,
  ) {}

  public async findAll(): Promise<StaffEntity[]> {
    const drivers = await this.prismaService.staff.findMany({
      include: { account: true },
    });
    return drivers;
  }

  public async findById(id: string): Promise<StaffEntity> {
    return this.prismaService.staff.findFirst({
      where: { id },
      include: { account: true },
    });
  }

  public async findByAzureOid(azureOid: string): Promise<StaffEntity> {
    const account = await this.azureAccountsService.findByAzureOid(azureOid);
    return this.prismaService.staff.findFirst({
      where: { accountId: account.id },
    });
  }

  public async findByEmail(email: string): Promise<StaffEntity> {
    const account = await this.azureAccountsService.findByEmail(email);
    return this.prismaService.staff.findFirst({
      where: { accountId: account.id },
    });
  }

  public async create(data: CreateStaffDto): Promise<StaffEntity> {
    const { ...user } = data;
    this.logger.log({
      context: `${AzureStaffsService.name} ${this.create.name}`,
      event_type: LogEventType.STAFF,
      reason: LogEventReason.STAFF_CREATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return this.prismaService.staff.create({
      data: {
        ...user,
      },
    });
  }

  public async update(id: string, data: UpdateStaffDto): Promise<StaffEntity> {
    const { ...user } = data;
    this.logger.log({
      context: `${AzureStaffsService.name} ${this.update.name}`,
      event_type: LogEventType.STAFF,
      reason: LogEventReason.STAFF_UPDATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...user,
      },
    });
  }

  public async deleteUser(id: string): Promise<StaffEntity> {
    this.logger.log({
      context: `${AzureStaffsService.name} ${this.deleteUser.name}`,
      event_type: LogEventType.STAFF,
      reason: LogEventReason.STAFF_DELETED,
    });

    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
