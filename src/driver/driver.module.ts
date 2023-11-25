import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from 'src/auth/password.service';
import { CustomLogger } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    DriverService,
    AuthService,
    UsersService,
    PasswordService,
    CustomLogger,
    JwtService,
  ],
  controllers: [DriverController],
})
export class DriverModule {}
