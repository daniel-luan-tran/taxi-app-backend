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
import { AzureDriversService } from '../azure-drivers.service';
const MOBILE_URL = process.env.MOBILE_URL;

@Injectable()
export class DriverRoleGuard implements CanActivate {
  constructor(private readonly azureDriversService: AzureDriversService) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const res = ctx.switchToHttp().getResponse();

    // const req = ctx
    //   .switchToHttp()
    //   .getRequest<Request & { user: AccountEntity }>();

    const req = ctx.switchToHttp().getRequest();

    if (!(req as any).isAuthenticated() || isNil(req.user))
      throw new UnauthorizedException();

    // Check id from drivers table
    const __user = await this.azureDriversService.findById(req.user.id);
    if (!__user) {
      // return res.redirect(`${MOBILE_URL}?invalidRole=true`);
      throw new ForbiddenException();
    }
    req.driver = __user;
    return true;
  }
}
