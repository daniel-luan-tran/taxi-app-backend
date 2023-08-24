import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserEntity } from '../users/entities/user.entity';
import { CurrentUser } from '../users/users.decorator';
import { AuthService } from './auth.service';
import { Role } from './entities/role.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { AzureAdGuard, AzureADAuthGuardLogin } from './guards/azure-ad.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard, ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  public login(@CurrentUser() user: UserEntity): UserEntity {
    return user;
  }

  @Get('/roles')
  @UseGuards(SessionAuthGuard)
  public async getRoles(): Promise<Role[]> {
    return Promise.resolve(Object.values(Role));
  }

  @Get('/check')
  @UseGuards(SessionAuthGuard)
  public check(@CurrentUser() user): UserEntity {
    return user;
  }

  @Delete('/logout')
  @UseGuards(SessionAuthGuard)
  public async logout(): Promise<void> {
    return this.authService.logout();
  }

  @Get('/azureAD/login')
  @UseGuards(AzureAdGuard)
  public async azureADLogin() {
    // This endpoint will trigger the Azure AD authentication flow
    // The actual login will be handled by Azure AD
  }

  @Post('/azureAD/callback')
  @UseGuards(AzureADAuthGuardLogin)
  public async azureADCallback(@CurrentUser() user) {
    // const redirectUrl = `${process.env.FRONTEND_URL}`;
    // return res.redirect(redirectUrl);
    return user;
  }

  @Get('/azureAD/check')
  @UseGuards(SessionAuthGuard)
  public async test(@CurrentUser() user) {
    return user;
  }

  @UseGuards(SessionAuthGuard)
  @Get('/azureAD/logout')
  public async logoutBearerAzure() {
    const logoutLink = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/logout?post_logout_redirect_uri=${process.env.MOBILE_URL}`;
    await this.authService.logout();
    return logoutLink;
  }
}
