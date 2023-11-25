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
import { PassengerService } from './passenger.service';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('passenger')
// @UseGuards(SessionAuthGuard)
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Get('/')
  public async getPassenger(): Promise<UserEntity[]> {
    const passengers = await this.passengerService.getPassenger();
    return passengers;
  }
}
