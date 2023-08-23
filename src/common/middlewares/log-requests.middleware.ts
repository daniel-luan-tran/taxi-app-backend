import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  LogEventType,
  RequestLogEvent,
} from '../../logger/entities/log-events';
import { CustomLogger } from '../../logger/logger.service';

@Injectable()
export class LogRequestsMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  public use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;

      const event: RequestLogEvent = {
        context: 'LogRequestsMiddleware',
        event_type: LogEventType.REQUEST,
        reason: `${method} ${originalUrl}`,
        metadata: {
          status_code: statusCode,
        },
      };

      if (statusCode === 500) {
        return this.logger.error(event);
      }

      this.logger.log(event);
    });

    next();
  }
}
