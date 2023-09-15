import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DriverEntity } from './entities/driver.entity';

export const CurrentDriver = createParamDecorator(
  (data: keyof DriverEntity, ctx: ExecutionContext) => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user: DriverEntity }>();
    return data ? user && user[parseInt(data, 10)] : user;
  },
);
