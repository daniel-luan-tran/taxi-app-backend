import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverEntity } from 'src/users/entities/driver.entity';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';

@Controller('driver')
@UseGuards(SessionAuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('/')
  public async findAll(): Promise<DriverEntity[]> {
    const drivers = await this.driverService.getDriver();
    return drivers;
  }
}
