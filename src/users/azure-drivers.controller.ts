import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverEntity } from './entities/driver.entity';
import { AzureDriversService } from './azure-drivers.service';
import { AccountEntity } from './entities/account.entity';
import { AzureAccountsService } from './azure-account.service';

@Controller('azureDrivers')
@UseGuards(SessionAuthGuard)
export class AzureUsersController {
  constructor(
    private readonly driversService: AzureDriversService,
    private readonly accountsService: AzureAccountsService,
  ) {}

  @Get('/')
  public async findAll(): Promise<AccountEntity[]> {
    return this.accountsService.findAll();
  }

  @Get('/:id')
  public async findById(@Param('id') id: string): Promise<AccountEntity> {
    return this.accountsService.findById(id);
  }

  @Get('/:id')
  public async findByAzureOid(
    @Param('azureOid') id: string,
  ): Promise<AccountEntity> {
    return this.accountsService.findById(id);
  }

  @Post('/')
  public async create(@Body() data: CreateDriverDto): Promise<DriverEntity> {
    return this.driversService.create(data);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateDriverDto,
  ): Promise<DriverEntity> {
    return this.driversService.update(id, data);
  }
}
