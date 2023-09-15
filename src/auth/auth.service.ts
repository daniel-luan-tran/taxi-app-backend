import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isNil } from 'lodash';
import { LogEventReason, LogEventType } from '../logger/entities/log-events';
import { CustomLogger } from '../logger/logger.service';
import { AccountEntity } from 'src/users/entities/account.entity';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly logger: CustomLogger,
    @Inject(REQUEST) private request: Request,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<AccountEntity | undefined> {
    // 🎯 Minimum 8 characters
    // 🎯 Should contain 1 or more numbers
    // 🎯 Should contain 1 or more symbols
    // 🎯 Should contain 1 or more letters
    const r = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    // Check password meets requirements
    if (!r.test(password)) {
      this.logger.log({
        context: 'AuthService validateUser',
        event_type: LogEventType.AUTHENTICATION,
        reason: LogEventReason.AUTHENTICATION_LOGIN_FAILED,
        metadata: { message: 'Password does not meet requirements' },
      });

      throw new BadRequestException();
    }

    const user = await this.usersService.findByEmail(email);

    // Check user exists
    if (isNil(user)) throw new NotFoundException();

    // Check user is active
    if (!user.active) {
      this.logger.log({
        context: 'AuthService validateUser',
        event_type: LogEventType.AUTHENTICATION,
        reason: LogEventReason.AUTHENTICATION_LOGIN_FAILED,
        metadata: { message: 'User is not active' },
      });

      throw new UnauthorizedException();
    }

    // Check password is correct
    if (!(await this.passwordService.checkPassword(user.id, password))) {
      this.logger.log({
        context: 'AuthService validateUser',
        event_type: LogEventType.AUTHENTICATION,
        reason: LogEventReason.AUTHENTICATION_LOGIN_FAILED,
        metadata: { message: 'Password is incorrect' },
      });

      throw new UnauthorizedException();
    }

    this.logger.log({
      context: 'AuthService validateUser',
      event_type: LogEventType.AUTHENTICATION,
      reason: LogEventReason.AUTHENTICATION_LOGIN_SUCCESSFUL,
    });

    return user;
  }

  public async logout(): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      if (this.request.session) {
        this.request.session.destroy((err) => {
          if (err) {
            this.logger.log({
              context: 'AuthService logout',
              event_type: LogEventType.AUTHENTICATION,
              reason: LogEventReason.AUTHENTICATION_LOGOUT_FAILED,
            });

            reject(err);
          }

          this.logger.log({
            context: 'AuthService logout',
            event_type: LogEventType.AUTHENTICATION,
            reason: LogEventReason.AUTHENTICATION_LOGOUT_SUCCESSFUL,
          });

          resolve();
        });
      }
    });
  }

  public async findById(id): Promise<AccountEntity> {
    return await this.usersService.findById(id);
  }
}
