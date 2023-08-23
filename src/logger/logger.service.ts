import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  AllowedLogEvent,
  LogEventFingerprint,
  LogEventOutput,
} from './entities/log-events';
import { winstonLogger } from './winston.logger';

@Injectable()
export class CustomLogger implements LoggerService {
  constructor(@Inject(REQUEST) private request: Request) {}

  private addFingerprint(logEvent: AllowedLogEvent): LogEventOutput {
    const logEventFingerprint: LogEventFingerprint = {
      userIdentifier: this.request.session?.passport?.user?.id ?? 'anonymous',
      userAgent: this.request.get('user-agent') || '',
      ip: this.request.ip,
    };

    return { ...logEvent, ...logEventFingerprint };
  }

  log(logEvent: AllowedLogEvent) {
    winstonLogger.info(logEvent.reason, this.addFingerprint(logEvent));
  }

  error(logEvent: AllowedLogEvent, trace?: string) {
    winstonLogger.error(logEvent.reason, {
      ...this.addFingerprint(logEvent),
      ...(trace ? { trace } : {}),
    });
  }

  warn(logEvent: AllowedLogEvent) {
    winstonLogger.warn(this.addFingerprint(logEvent));
  }

  debug(logEvent: AllowedLogEvent) {
    winstonLogger.debug(this.addFingerprint(logEvent));
  }

  verbose(logEvent: AllowedLogEvent) {
    winstonLogger.verbose(this.addFingerprint(logEvent));
  }
}
