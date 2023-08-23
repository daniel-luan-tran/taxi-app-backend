import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import {
  AzureADAuthGuardLogin,
  AzureAdGuard,
  BearerGuard,
} from './guards/azure-ad.guard';
import { AzureUsersService } from 'src/users/azure-users.service';
import { BearerStrategyPassport } from './strategies/bearer.strategy';
import { OIDCStrategyPassport } from './strategies/oidc.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    LoggerModule,
    PassportModule.register({ defaultStrategy: 'azure-ad', session: true }),
  ],
  providers: [
    AuthService,
    PasswordService,
    UsersService,
    LocalStrategy,
    SessionSerializer,
    OIDCStrategyPassport,
    AzureADAuthGuardLogin,
    AzureAdGuard,
    BearerGuard,
    BearerStrategyPassport,
    AzureUsersService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
