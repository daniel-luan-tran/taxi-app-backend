import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import { CustomLogger } from '../logger/logger.service';
import * as _ from 'lodash';
import { AzureAccountsService } from './azure-account.service';

@Injectable()
export class AzureUsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
    private readonly azureAccountsService: AzureAccountsService,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    const drivers = await this.prismaService.user.findMany({
      include: { account: true },
    });
    return drivers;
  }

  public async findById(id: string): Promise<UserEntity> {
    return this.prismaService.user.findFirst({
      where: { accountId: id },
      include: { account: true },
    });
  }

  public async findByAzureOid(azureOid: string): Promise<UserEntity> {
    const account = await this.azureAccountsService.findByAzureOid(azureOid);
    return this.prismaService.user.findFirst({
      where: { accountId: account.id },
    });
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    const account = await this.azureAccountsService.findByEmail(email);
    return this.prismaService.user.findFirst({
      where: { accountId: account.id },
    });
  }

  public async create(data: CreateUserDto): Promise<UserEntity> {
    const { ...user } = data;
    this.logger.log({
      context: `${AzureUsersService.name} ${this.create.name}`,
      event_type: LogEventType.USER,
      reason: LogEventReason.USER_CREATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return this.prismaService.user.create({
      data: {
        ...user,
      },
    });
  }

  public async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const { ...user } = data;
    this.logger.log({
      context: `${AzureUsersService.name} ${this.update.name}`,
      event_type: LogEventType.USER,
      reason: LogEventReason.USER_UPDATED,
      metadata: { ..._.pick(data, ['id']) },
    });

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...user,
      },
    });
  }

  public async deleteUser(id: string): Promise<UserEntity> {
    this.logger.log({
      context: `${AzureUsersService.name} ${this.deleteUser.name}`,
      event_type: LogEventType.USER,
      reason: LogEventReason.USER_DELETED,
    });

    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
