import { Module } from '@nestjs/common';
import { DriverTypeService } from './driver-type.service';
import { DriverTypeController } from './driver-type.controller';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/auth/password.service';
import { CustomLogger } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    DriverTypeService,
    AuthService,
    UsersService,
    PasswordService,
    CustomLogger,
    JwtService,
  ],
  controllers: [DriverTypeController],
})
export class DriverTypeModule {}
