import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../../users/entities/user.entity';
import { ErrorMessage } from '../../common/constants/messages';
import { AzureUsersService } from 'src/users/azure-users.service';
import { AzureAccountsService } from 'src/users/azure-account.service';
import { AzureDriversService } from 'src/users/azure-drivers.service';
import { AzureStaffsService } from 'src/users/azure-staffs.service';
import { AccountEntity } from 'src/users/entities/account.entity';
const FRONTEND_URL = process.env.FRONTEND_URL;

@Injectable()
export class AzureAdGuard extends AuthGuard('azure-ad') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}

@Injectable()
export class AzureAdGuardForStaffs extends AuthGuard('azure-ad-for-staffs') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}

@Injectable()
export class AzureAdGuardForDrivers extends AuthGuard('azure-ad-for-drivers') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}

@Injectable()
export class BearerGuard extends AuthGuard('bearer') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      if (!req.isAuthenticated()) {
        throw new UnauthorizedException();
      }
    }
    return result;
  }
}

// For Users/ Passengers
@Injectable()
export class AzureADAuthGuardLogin extends AuthGuard('bearer') {
  constructor(
    private readonly azureUsersService: AzureUsersService,
    private readonly azureAccountsService: AzureAccountsService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.body.id_token;
    const decodedToken = jwt.decode(token, {
      complete: true,
    });
    request.code = request.body.code;
    if (!decodedToken) return false;
    const azureOid = decodedToken.payload.oid || decodedToken.payload.sub;
    const email = decodedToken.payload.email;
    const active = true;
    const firstName = decodedToken.payload.given_name || '';
    const lastName = decodedToken.payload.family_name || '';
    const displayName = decodedToken.payload.name || '';

    // Check azureOid from accounts table
    let _user = await this.azureAccountsService.findByAzureOid(azureOid);

    const userProfile = {
      email,
      active,
      azureOid,
      firstName,
      lastName,
      displayName,
    };
    if (!_user) {
      _user = await this.azureAccountsService.create({
        ...userProfile,
      });
    }
    if (!_user.active) {
      return response.redirect(`${FRONTEND_URL}?userInactive=true`);
    }

    // Check azureOid from users table
    const __user = await this.azureUsersService.findByAzureOid(azureOid);
    if (!__user) {
      return response.redirect(`${FRONTEND_URL}?invalidRole=true`);
    }

    request.userProfile = userProfile;
    request.azureOid = azureOid;
    request.token = token;
    const user: UserEntity = request.userProfile;
    request.user = user;
    request.user.id = _user.id;

    await super.logIn(request);
    return true;
  }
}

@Injectable()
export class AzureADAuthGuardLoginForStaffs extends AuthGuard('bearer') {
  constructor(
    private readonly azureStaffsService: AzureStaffsService,
    private readonly azureAccountsService: AzureAccountsService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.body.id_token;
    const decodedToken = jwt.decode(token, {
      complete: true,
    });
    request.code = request.body.code;
    if (!decodedToken) return false;
    const azureOid = decodedToken.payload.oid || decodedToken.payload.sub;
    const email = decodedToken.payload.email;
    const active = true;
    const firstName = decodedToken.payload.given_name || '';
    const lastName = decodedToken.payload.family_name || '';
    const displayName = decodedToken.payload.name || '';

    // Check azureOid from accounts table
    let _user = await this.azureAccountsService.findByAzureOid(azureOid);

    const userProfile = {
      email,
      active,
      azureOid,
      firstName,
      lastName,
      displayName,
    };
    if (!_user) {
      _user = await this.azureAccountsService.create({
        ...userProfile,
      });
    }
    if (!_user.active) {
      return response.redirect(`${FRONTEND_URL}?userInactive=true`);
    }

    // Check azureOid from staffs table
    const __user = await this.azureStaffsService.findByAzureOid(azureOid);
    if (!__user) {
      return response.redirect(`${FRONTEND_URL}?invalidRole=true`);
    }

    request.userProfile = userProfile;
    request.azureOid = azureOid;
    request.token = token;
    const user: UserEntity = request.userProfile;
    request.user = user;
    request.user.id = _user.id;

    await super.logIn(request);
    return true;
  }
}

@Injectable()
export class AzureADAuthGuardLoginForDrivers extends AuthGuard('bearer') {
  constructor(
    private readonly azureDriversService: AzureDriversService,
    private readonly azureAccountsService: AzureAccountsService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.body.id_token;
    const decodedToken = jwt.decode(token, {
      complete: true,
    });
    request.code = request.body.code;
    if (!decodedToken) return false;
    const azureOid = decodedToken.payload.oid || decodedToken.payload.sub;
    const email = decodedToken.payload.email;
    const active = true;
    const firstName = decodedToken.payload.given_name || '';
    const lastName = decodedToken.payload.family_name || '';
    const displayName = decodedToken.payload.name || '';

    // Check azureOid from accounts table
    let _user = await this.azureAccountsService.findByAzureOid(azureOid);

    const userProfile = {
      email,
      active,
      azureOid,
      firstName,
      lastName,
      displayName,
    };
    if (!_user) {
      _user = await this.azureAccountsService.create({
        ...userProfile,
      });
    }
    if (!_user.active) {
      return response.redirect(`${FRONTEND_URL}?userInactive=true`);
    }

    // Check azureOid from drivers table
    const __user = await this.azureDriversService.findByAzureOid(azureOid);
    if (!__user) {
      return response.redirect(`${FRONTEND_URL}?invalidRole=true`);
    }

    request.userProfile = userProfile;
    request.azureOid = azureOid;
    request.token = token;
    const user: AccountEntity = request.userProfile;
    request.user = user;
    request.user.id = _user.id;

    await super.logIn(request);
    return true;
  }
}
