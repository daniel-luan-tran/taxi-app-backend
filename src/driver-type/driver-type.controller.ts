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
import { DriverTypeService } from './driver-type.service';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { DriverTypeEntity } from 'src/users/entities/driver.entity';

@Controller('driver-type')
export class DriverTypeController {
  constructor(private readonly driverTypeService: DriverTypeService) {}

  @Get('/')
  // @UseGuards(SessionAuthGuard)
  public async findAll(): Promise<DriverTypeEntity[]> {
    const driverTypes = await this.driverTypeService.findAll();
    return driverTypes;
  }
}
