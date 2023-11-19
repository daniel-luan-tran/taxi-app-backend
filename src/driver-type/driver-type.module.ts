import { Module } from '@nestjs/common';
import { DriverTypeService } from './driver-type.service';
import { DriverTypeController } from './driver-type.controller';
import { AuthService } from 'src/auth/auth.service';
import { PasswordService } from 'src/auth/password.service';
import { CustomLogger } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [
    DriverTypeService,
    AuthService,
    UsersService,
    PasswordService,
    CustomLogger,
  ],
  controllers: [DriverTypeController],
})
export class DriverTypeModule {}
