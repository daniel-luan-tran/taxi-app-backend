import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccountEntity } from './entities/account.entity';

export const CurrentAccount = createParamDecorator(
  (data: keyof AccountEntity, ctx: ExecutionContext) => {
    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user: AccountEntity }>();
    return data ? user && user[parseInt(data, 10)] : user;
  },
);
