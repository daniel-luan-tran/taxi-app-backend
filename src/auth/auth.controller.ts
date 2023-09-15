import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserEntity } from '../users/entities/user.entity';
import { CurrentUser } from '../users/users.decorator';
import { AuthService } from './auth.service';
import { Role } from './entities/role.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import {
  AzureAdGuard,
  AzureADAuthGuardLogin,
  AzureAdGuardForStaffs,
  AzureADAuthGuardLoginForStaffs,
  AzureAdGuardForDrivers,
  AzureADAuthGuardLoginForDrivers,
} from './guards/azure-ad.guard';
import { AzureUsersService } from 'src/users/azure-users.service';
import { CurrentDriver } from 'src/users/drivers.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly azureUserService: AzureUsersService,
  ) {}

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

  @Get('/azureAD/login-for-staffs')
  @UseGuards(AzureAdGuardForStaffs)
  public async azureADLoginForStaffs() {
    // This endpoint will trigger the Azure AD authentication flow
    // The actual login will be handled by Azure AD
  }

  @Get('/azureAD/login-for-driver')
  @UseGuards(AzureAdGuardForDrivers)
  public async azureADLoginForDrivers() {
    // This endpoint will trigger the Azure AD authentication flow
    // The actual login will be handled by Azure AD
  }

  // For passengers ~ users
  @Post('/azureAD/callback')
  @UseGuards(AzureADAuthGuardLogin)
  public async azureADCallback(@CurrentUser() user) {
    // const redirectUrl = `${process.env.FRONTEND_URL}`;
    // return res.redirect(redirectUrl);
    return user;
  }

  @Post('/azureAD/callbackforstaffs')
  @UseGuards(AzureADAuthGuardLoginForStaffs)
  public async azureADCallbackForStaffs(@CurrentUser() user) {
    // const redirectUrl = `${process.env.FRONTEND_URL}`;
    // return res.redirect(redirectUrl);
    return user;
  }

  @Post('/azureAD/callbackfordrivers')
  @UseGuards(AzureADAuthGuardLoginForDrivers)
  public async azureADCallbackForDrivers(@CurrentDriver() driver) {
    // const redirectUrl = `${process.env.FRONTEND_URL}`;
    // return res.redirect(redirectUrl);
    return driver;
  }

  @Get('/azureAD/check')
  @UseGuards(SessionAuthGuard)
  public async test(@CurrentUser() user) {
    return user;
  }

  @Get('/azureAD/delete-user')
  @UseGuards(SessionAuthGuard)
  public async deleteUser(@CurrentUser() user) {
    await this.azureUserService.deleteUser(user.id);
    return { msg: 'User deleted' };
  }

  @UseGuards(SessionAuthGuard)
  @Get('/azureAD/logout')
  public async logoutBearerAzure() {
    const logoutLink = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/logout?post_logout_redirect_uri=${process.env.FRONTEND_URL}`;
    await this.authService.logout();
    return logoutLink;
  }
}
