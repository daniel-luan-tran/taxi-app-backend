import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PasswordService } from '../auth/password.service';
import { LoggerModule } from '../logger/logger.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AzureUsersService } from './azure-users.service';
import { AzureUsersController } from './azure-users.controller';

@Module({
  imports: [LoggerModule],
  providers: [UsersService, AzureUsersService, AuthService, PasswordService],
  controllers: [UsersController, AzureUsersController],
  exports: [UsersService, AzureUsersService],
})
export class UsersModule {}
