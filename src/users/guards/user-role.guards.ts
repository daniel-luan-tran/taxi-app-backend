import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { isNil } from 'lodash';
import { AccountEntity } from '../entities/account.entity';
import { AzureUsersService } from '../azure-users.service';
const MOBILE_URL = process.env.MOBILE_URL;

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly azureUsersService: AzureUsersService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const res = ctx.switchToHttp().getResponse();

    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user: AccountEntity }>();

    if (!(req as any).isAuthenticated() || isNil(req.user))
      throw new UnauthorizedException();

    // Check id from drivers table
    const __user = await this.azureUsersService.findById(req.user.id);
    if (!__user) {
      // return res.redirect(`${MOBILE_URL}?invalidRole=true`);
      throw new ForbiddenException();
    }
    return true;
  }
}
