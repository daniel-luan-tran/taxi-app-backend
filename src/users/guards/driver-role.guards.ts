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

    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user: AccountEntity }>();

    if (!(req as any).isAuthenticated() || isNil(req.user))
      throw new UnauthorizedException();

    // Check azureOid from drivers table
    const __user = await this.azureDriversService.findByAzureOid(
      req.user.azureOid,
    );
    if (!__user || !__user.driverTypeId) {
      // return res.redirect(`${MOBILE_URL}?invalidRole=true`);
      throw new ForbiddenException();
    }
    return true;
  }
}
