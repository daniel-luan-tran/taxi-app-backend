import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from 'src/auth/password.service';
import { CustomLogger } from 'src/logger/logger.service';

@Module({
  providers: [
    PassengerService,
    AuthService,
    UsersService,
    PasswordService,
    CustomLogger,
  ],
  controllers: [PassengerController],
})
export class PassengerModule {}
