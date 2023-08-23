import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LogEventReason, LogEventType } from 'src/logger/entities/log-events';
import { CustomLogger } from '../logger/logger.service';
import * as _ from 'lodash';

@Injectable()
export class AzureUsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: CustomLogger,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return this.prismaService.user.findMany({
      where: {
        azureOid: {
          not: null,
        },
      },
    });
  }

  public async findById(id: string): Promise<UserEntity> {
    return this.prismaService.user.findFirst({
      where: { id },
    });
  }

  public async findByAzureOid(azureOid: string): Promise<UserEntity> {
    return this.prismaService.user.findFirst({
      where: { azureOid },
    });
  }

  public async findByEmail(email: string): Promise<UserEntity> {
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }

  public async create(data: CreateUserDto): Promise<UserEntity> {
    const { password, ...user } = data;
    this.logger.log({
      context: `${AzureUsersService.name} ${this.create.name}`,
      event_type: LogEventType.USER,
      reason: LogEventReason.USER_CREATED,
      metadata: { ..._.pick(data, ['id', 'role']) },
    });

    return this.prismaService.user.create({
      data: {
        ...user,
      },
    });
  }

  public async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const { password, ...user } = data;
    this.logger.log({
      context: `${AzureUsersService.name} ${this.update.name}`,
      event_type: LogEventType.USER,
      reason: LogEventReason.USER_UPDATED,
      metadata: { ..._.pick(data, ['id', 'role']) },
    });

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...user,
      },
    });
  }
}
