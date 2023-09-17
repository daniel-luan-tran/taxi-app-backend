import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PasswordService } from '../auth/password.service';
import { LoggerModule } from '../logger/logger.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AzureUsersService } from './azure-users.service';
import { AzureUsersController } from './azure-users.controller';
import { AzureDriversService } from './azure-drivers.service';
import { AzureAccountsService } from './azure-account.service';
import { AzureStaffsService } from './azure-staffs.service';
import { AzureDriversController } from './azure-drivers.controller';

@Module({
  imports: [LoggerModule],
  providers: [
    UsersService,
    AzureUsersService,
    AuthService,
    PasswordService,
    AzureDriversService,
    AzureAccountsService,
    AzureStaffsService,
  ],
  controllers: [UsersController, AzureUsersController, AzureDriversController],
  exports: [UsersService, AzureUsersService],
})
export class UsersModule {}
